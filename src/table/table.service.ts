import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RestaurantTable } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { User } from '../users/entities/user.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@Injectable()
export class TableService {
  constructor(
    @InjectModel(RestaurantTable) private tableRepo: typeof RestaurantTable,
    @InjectModel(Restaurant) private restaurantRepo: typeof Restaurant,
  ) {}

  async create(dto: CreateTableDto, user: User) {
    const restaurant = await this.restaurantRepo.findByPk(dto.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only add tables to your own restaurant.',
      );
    }

    return this.tableRepo.create(dto);
  }

  async findAll(user: User) {
    if (user.role === 'manager') {
      const restaurants = await this.restaurantRepo.findAll({
        where: { manager_id: user.id },
      });
      const ids = restaurants.map((r) => r.id);

      return this.tableRepo.findAll({
        where: { restaurant_id: ids },
        include: [
          {
            model: Restaurant,
            attributes: ['name', 'phone_number', 'description'],
          },
        ],
      });
    }

    return this.tableRepo.findAll({
      include: [
        {
          model: Restaurant,
          attributes: ['name', 'phone_number', 'description'],
        },
      ],
    });
  }

  async findOne(id: number, user: User) {
    const table = await this.tableRepo.findByPk(id, {
      include: [
        {
          model: Restaurant,
          attributes: ['name', 'phone_number', 'description'],
        },
      ],
    });
    if (!table) throw new NotFoundException('Table not found');

    const restaurant = await this.restaurantRepo.findByPk(table.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only view tables of your own restaurant.',
      );
    }

    return table;
  }

  async update(id: number, dto: UpdateTableDto, user: User) {
    const table = await this.tableRepo.findByPk(id);
    if (!table) throw new NotFoundException('Table not found');

    const restaurant = await this.restaurantRepo.findByPk(table.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only update tables of your own restaurant.',
      );
    }

    return table.update(dto);
  }

  async remove(id: number, user: User) {
    const table = await this.tableRepo.findByPk(id);
    if (!table) throw new NotFoundException('Table not found');

    const restaurant = await this.restaurantRepo.findByPk(table.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only delete tables of your own restaurant.',
      );
    }

    await table.destroy();
    return { message: 'Table deleted successfully.' };
  }
}
