import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant) private restaurantRepo: typeof Restaurant,
  ) {}

  async create(dto: CreateRestaurantDto, user: User) {
    return this.restaurantRepo.create({
      ...dto,
      is_active: true,
      manager_id: user.id,
    });
  }

  async findAll(user?: User) {
    const whereClause: any = {};
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      whereClause.is_active = true;
    }

    return this.restaurantRepo.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['full_name', 'email', 'phone_number'],
        },
      ],
    });
  }

  async findOne(id: number, user?: User) {
    const restaurant = await this.restaurantRepo.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['full_name', 'email', 'phone_number'],
        },
      ],
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    if (
      !restaurant.is_active &&
      (!user || !['admin', 'super_admin'].includes(user.role))
    ) {
      throw new ForbiddenException(
        'You are not allowed to view this restaurant.',
      );
    }
    return restaurant;
  }

  async findOneRaw(id: number) {
    const restaurant = await this.restaurantRepo.findByPk(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found.');
    }
    return restaurant;
  }

  async update(id: number, dto: UpdateRestaurantDto, user: User) {
    const restaurant = await this.restaurantRepo.findByPk(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if ('is_active' in dto && !['admin', 'manager'].includes(user.role)) {
      throw new ForbiddenException(
        'You are not allowed to change is_active status.',
      );
    }

    return restaurant.update(dto);
  }

  async remove(id: number) {
    const restaurant = await this.restaurantRepo.findByPk(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    await restaurant.destroy();
    return { message: 'Restaurant deleted successfully.' };
  }
}
