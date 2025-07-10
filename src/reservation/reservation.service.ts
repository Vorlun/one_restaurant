import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { RestaurantTable } from '../table/entities/table.entity';
import { User } from '../users/entities/user.entity';
import { MenuItem } from '../menu_item/entities/menu_item.entity';
import { Op } from 'sequelize';
import { ReservationMenuItem } from './entities/reservation-menu-item.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation) private reservationRepo: typeof Reservation,
    @InjectModel(Restaurant) private restaurantRepo: typeof Restaurant,
    @InjectModel(RestaurantTable) private tableRepo: typeof RestaurantTable,
    @InjectModel(User) private userRepo: typeof User,
    @InjectModel(MenuItem) private menuItemRepo: typeof MenuItem,
    @InjectModel(ReservationMenuItem)
    private reservationMenuItemRepo: typeof ReservationMenuItem,
  ) {}

  async create(dto: CreateReservationDto) {
    const [restaurant, table, user] = await Promise.all([
      this.restaurantRepo.findByPk(dto.restaurant_id),
      this.tableRepo.findByPk(dto.table_id),
      this.userRepo.findByPk(dto.user_id),
    ]);

    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (!table) throw new NotFoundException('Table not found');
    if (!user) throw new NotFoundException('User not found');

    const existingReservation = await this.reservationRepo.findOne({
      where: {
        table_id: dto.table_id,
        reservation_date: dto.reservation_date,
      },
    });
    if (existingReservation) {
      throw new ConflictException(
        'This table is already reserved on this date.',
      );
    }

    let totalPrice = table.price ? Number(table.price) : 0;
    const reservation = await this.reservationRepo.create({
      ...dto,
      total_price: 0,
    });

    if (dto.menu_items?.length) {
      for (const [menu_item_id, quantity] of dto.menu_items) {
        const menuItem = await this.menuItemRepo.findByPk(menu_item_id);
        if (!menuItem) {
          throw new BadRequestException(
            `Menu item with id ${menu_item_id} not found`,
          );
        }
        await this.reservationMenuItemRepo.create({
          reservation_id: reservation.id,
          menu_item_id,
          quantity,
        });
        totalPrice += Number(menuItem.price) * quantity;
      }
    }

    totalPrice += totalPrice * 0.15;
    await reservation.update({ total_price: +totalPrice.toFixed(2) });
    await table.update({ is_available: false });

    return reservation;
  }

  async findAll(user?: any) {
    const where =
      user?.role === 'manager' ? { '$restaurant.manager_id$': user.id } : {};
    return this.reservationRepo.findAll({
      where,
      include: [
        {
          model: Restaurant,
          attributes: ['id', 'name', 'phone_number', 'manager_id'],
        },
        {
          model: RestaurantTable,
          attributes: ['id', 'table_number', 'capacity'],
        },
        {
          model: User,
          attributes: ['id', 'full_name', 'email', 'phone_number'],
        },
        {
          model: MenuItem,
          attributes: ['id', 'name', 'price'],
          through: { attributes: ['quantity'] },
        },
      ],
    });
  }

  async findOne(id: number) {
    const reservation = await this.reservationRepo.findByPk(id, {
      include: [
        {
          model: Restaurant,
          attributes: ['id', 'name', 'phone_number', 'manager_id'],
        },
        {
          model: RestaurantTable,
          attributes: ['id', 'table_number', 'capacity'],
        },
        {
          model: User,
          attributes: ['id', 'full_name', 'email', 'phone_number'],
        },
        {
          model: MenuItem,
          attributes: ['id', 'name', 'price'],
          through: { attributes: ['quantity'] },
        },
      ],
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation;
  }

  async update(id: number, dto: UpdateReservationDto) {
    const reservation = await this.reservationRepo.findByPk(id);
    if (!reservation) throw new NotFoundException('Reservation not found');

    if (dto.is_approved !== undefined) {
      reservation.is_approved = dto.is_approved;
    }

    if (dto.menu_items?.length) {
      await this.reservationMenuItemRepo.destroy({
        where: { reservation_id: reservation.id },
      });
      let totalPrice = 0;
      for (const [menu_item_id, quantity] of dto.menu_items) {
        const menuItem = await this.menuItemRepo.findByPk(menu_item_id);
        if (!menuItem) {
          throw new BadRequestException(
            `Menu item with id ${menu_item_id} not found`,
          );
        }
        await this.reservationMenuItemRepo.create({
          reservation_id: reservation.id,
          menu_item_id,
          quantity,
        });
        totalPrice += Number(menuItem.price) * quantity;
      }
      const table = await this.tableRepo.findByPk(reservation.table_id);
      if (table) totalPrice += table.price ? Number(table.price) : 0;
      totalPrice += totalPrice * 0.15;
      reservation.total_price = +totalPrice.toFixed(2);
    }

    await reservation.save();
    return reservation;
  }

  async remove(id: number) {
    const reservation = await this.reservationRepo.findByPk(id);
    if (!reservation) throw new NotFoundException('Reservation not found');
    const table = await this.tableRepo.findByPk(reservation.table_id);
    if (table) await table.update({ is_available: true });
    await reservation.destroy();
    return { message: 'Reservation deleted successfully.' };
  }

  async getAvailableTables(
    restaurant_id: number,
    reservation_date: string,
    reservation_time: string,
  ) {
    const reservedTables = await this.reservationRepo.findAll({
      where: { restaurant_id, reservation_date, reservation_time },
      attributes: ['table_id'],
    });
    const reservedTableIds = reservedTables.map((r) => r.table_id);
    return this.tableRepo.findAll({
      where: {
        restaurant_id,
        is_available: true,
        id: { [Op.notIn]: reservedTableIds },
      },
    });
  }

  async getApprovedReservations(user: any) {
    const where: any = { is_approved: true };
    if (user?.role === 'manager') {
      where['$restaurant.manager_id$'] = user.id;
    }
    return this.reservationRepo.findAll({
      where,
      include: [
        { model: Restaurant, attributes: ['id', 'name'] },
        { model: RestaurantTable, attributes: ['id', 'table_number'] },
        { model: User, attributes: ['id', 'full_name'] },
        { model: MenuItem, attributes: ['id', 'name', 'price'] },
      ],
    });
  }

  async getRestaurantById(id: number) {
    return this.restaurantRepo.findByPk(id, {
      attributes: ['id', 'name', 'manager_id'],
    });
  }

  async findOneRaw(id: number) {
    const reservation = await this.reservationRepo.findByPk(id, {
      include: [
        { model: Restaurant, attributes: ['id', 'name', 'manager_id'] },
        {
          model: RestaurantTable,
          attributes: ['id', 'table_number', 'capacity'],
        },
        {
          model: User,
          attributes: ['id', 'full_name', 'email', 'phone_number'],
        },
      ],
    });
    if (!reservation) return null;
    return reservation.get({ plain: true });
  }

  async addMenuItemsToReservation(
    id: number,
    menu_items_with_quantity: [number, number][],
  ) {
    const reservation = await this.reservationRepo.findByPk(id);
    if (!reservation) throw new NotFoundException('Reservation not found');

    const menu_item_ids = menu_items_with_quantity.map(
      ([menu_item_id]) => menu_item_id,
    );
    const menuItems = await this.menuItemRepo.findAll({
      where: { id: menu_item_ids },
    });

    if (menuItems.length !== menu_item_ids.length) {
      const foundIds = menuItems.map((item) => item.id);
      const missingIds = menu_item_ids.filter((id) => !foundIds.includes(id));
      throw new BadRequestException(
        `Menu items not found: ${missingIds.join(', ')}`,
      );
    }

    for (const [menu_item_id, quantityToAdd] of menu_items_with_quantity) {
      const existingRmi = await this.reservationMenuItemRepo.findOne({
        where: { reservation_id: reservation.id, menu_item_id },
      });

      if (existingRmi) {
        await existingRmi.update({
          quantity: existingRmi.quantity + quantityToAdd,
        });
      } else {
        await this.reservationMenuItemRepo.create({
          reservation_id: reservation.id,
          menu_item_id,
          quantity: quantityToAdd,
        });
      }
    }

    let totalPrice = 0;
    const table = await this.tableRepo.findByPk(reservation.table_id);
    if (table?.price) {
      totalPrice += Number(table.price);
    }

    const reservationMenuItems = await this.reservationMenuItemRepo.findAll({
      where: { reservation_id: reservation.id },
      include: [{ model: MenuItem, as: 'menu_item' }],
    });

    for (const rmi of reservationMenuItems) {
      if (!rmi.menu_item) {
        throw new NotFoundException(
          `Menu item with id ${rmi.menu_item_id} not found for calculation.`,
        );
      }
      totalPrice += Number(rmi.menu_item.price) * rmi.quantity;
    }

    totalPrice += totalPrice * 0.15; // 15% komissiya
    reservation.total_price = +totalPrice.toFixed(2);
    await reservation.save();

    return reservation;
  }
}
