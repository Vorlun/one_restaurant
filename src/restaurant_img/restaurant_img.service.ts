import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RestaurantImg } from './entities/restaurant_img.entity';
import { CreateRestaurantImgDto } from './dto/create-restaurant_img.dto';
import { UpdateRestaurantImgDto } from './dto/update-restaurant_img.dto';
import { User } from '../users/entities/user.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@Injectable()
export class RestaurantImgService {
  constructor(
    @InjectModel(RestaurantImg) private imgRepo: typeof RestaurantImg,
    @InjectModel(Restaurant) private restaurantRepo: typeof Restaurant,
  ) {}

  async create(dto: CreateRestaurantImgDto, user: User) {
    const restaurant = await this.restaurantRepo.findByPk(dto.restaurant_id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only add images to your own restaurant.',
      );
    }

    if (dto.is_primary) {
      await this.imgRepo.update(
        { is_primary: false },
        { where: { restaurant_id: dto.restaurant_id } },
      );
    }

    return this.imgRepo.create(dto);
  }

  async findAll(user: User) {
    if (user.role === 'manager') {
      const restaurants = await this.restaurantRepo.findAll({
        where: { manager_id: user.id },
      });
      const restaurantIds = restaurants.map((r) => r.id);

      return this.imgRepo.findAll({
        where: { restaurant_id: restaurantIds },
        include: [
          {
            model: Restaurant,
            attributes: ['name', 'phone_number', 'description'],
          },
        ],
      });
    }

    return this.imgRepo.findAll({
      include: [
        {
          model: Restaurant,
          attributes: ['name', 'phone_number', 'description'],
        },
      ],
    });
  }

  async findOne(id: number, user: User) {
    const img = await this.imgRepo.findByPk(id, {
      include: [
        {
          model: Restaurant,
          attributes: ['name', 'phone_number', 'description'],
        },
      ],
    });
    if (!img) throw new NotFoundException('Restaurant image not found');

    const restaurant = await this.restaurantRepo.findByPk(img.restaurant_id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only view images of your own restaurant.',
      );
    }

    return img;
  }

  async update(id: number, dto: UpdateRestaurantImgDto, user: User) {
    const img = await this.imgRepo.findByPk(id);
    if (!img) throw new NotFoundException('Restaurant image not found');

    const restaurant = await this.restaurantRepo.findByPk(img.restaurant_id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only update images of your own restaurant.',
      );
    }

    return img.update(dto);
  }

  async remove(id: number, user: User) {
    const img = await this.imgRepo.findByPk(id);
    if (!img) throw new NotFoundException('Restaurant image not found');

    const restaurant = await this.restaurantRepo.findByPk(img.restaurant_id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only delete images of your own restaurant.',
      );
    }

    await img.destroy();
    return { message: 'Restaurant image deleted successfully.' };
  }
}
