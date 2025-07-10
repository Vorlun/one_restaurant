import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Menu } from './entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { User } from '../users/entities/user.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu) private menuRepo: typeof Menu,
    @InjectModel(Restaurant) private restaurantRepo: typeof Restaurant,
  ) {}

  async create(dto: CreateMenuDto, user: User) {
    const restaurant = await this.restaurantRepo.findByPk(dto.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only add menus to your own restaurant.',
      );
    }

    return this.menuRepo.create(dto);
  }

  async findAll(user: User) {
    let whereClause: any = {};
    if (user.role === 'manager') {
      const restaurants = await this.restaurantRepo.findAll({
        where: { manager_id: user.id },
      });
      const ids = restaurants.map((r) => r.id);
      whereClause = { restaurant_id: ids };
    }

    return this.menuRepo.findAll({
      where: whereClause,
      include: [
        {
          model: Restaurant,
          attributes: ['name', 'phone_number', 'description'],
        },
      ],
    });
  }

  async findOne(id: number, user: User) {
    const menu = await this.menuRepo.findByPk(id, {
      include: [
        {
          model: Restaurant,
          attributes: ['name', 'phone_number', 'description'],
        },
      ],
    });
    if (!menu) throw new NotFoundException('Menu not found');

    const restaurant = await this.restaurantRepo.findByPk(menu.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only view menus of your own restaurant.',
      );
    }

    return menu;
  }

  async update(id: number, dto: UpdateMenuDto, user: User) {
    const menu = await this.menuRepo.findByPk(id);
    if (!menu) throw new NotFoundException('Menu not found');

    const restaurant = await this.restaurantRepo.findByPk(menu.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only update menus of your own restaurant.',
      );
    }

    return menu.update(dto);
  }

  async remove(id: number, user: User) {
    const menu = await this.menuRepo.findByPk(id);
    if (!menu) throw new NotFoundException('Menu not found');

    const restaurant = await this.restaurantRepo.findByPk(menu.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only delete menus of your own restaurant.',
      );
    }

    await menu.destroy();
    return { message: 'Menu deleted successfully.' };
  }
}
