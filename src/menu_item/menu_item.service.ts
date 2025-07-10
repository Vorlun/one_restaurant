import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MenuItem } from './entities/menu_item.entity';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { Menu } from '../menu/entities/menu.entity';
import { User } from '../users/entities/user.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectModel(MenuItem) private itemRepo: typeof MenuItem,
    @InjectModel(Menu) private menuRepo: typeof Menu,
    @InjectModel(Restaurant) private restaurantRepo: typeof Restaurant,
  ) {}

  async create(dto: CreateMenuItemDto, user: User) {
    const menu = await this.menuRepo.findByPk(dto.menu_id);
    if (!menu) throw new NotFoundException('Menu not found');

    const restaurant = await this.restaurantRepo.findByPk(menu.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only add items to your own restaurant.',
      );
    }

    return this.itemRepo.create(dto);
  }

  async findAll(user: User) {
    if (user.role === 'manager') {
      const restaurants = await this.restaurantRepo.findAll({
        where: { manager_id: user.id },
      });
      const restaurantIds = restaurants.map((r) => r.id);

      const menus = await this.menuRepo.findAll({
        where: { restaurant_id: restaurantIds },
      });
      const menuIds = menus.map((m) => m.id);

      return this.itemRepo.findAll({
        where: { menu_id: menuIds },
        include: [{ model: Menu }],
      });
    }

    return this.itemRepo.findAll({
      include: [{ model: Menu }],
    });
  }

  async findOne(id: number, user: User) {
    const item = await this.itemRepo.findByPk(id, {
      include: [{ model: Menu }],
    });
    if (!item) throw new NotFoundException('Menu item not found');

    const menu = await this.menuRepo.findByPk(item.menu_id);
    if (!menu) throw new NotFoundException('Menu not found');

    const restaurant = await this.restaurantRepo.findByPk(menu.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only view items of your own restaurant.',
      );
    }

    return item;
  }

  async update(id: number, dto: UpdateMenuItemDto, user: User) {
    const item = await this.itemRepo.findByPk(id);
    if (!item) throw new NotFoundException('Menu item not found');

    const menu = await this.menuRepo.findByPk(item.menu_id);
    if (!menu) throw new NotFoundException('Menu not found');

    const restaurant = await this.restaurantRepo.findByPk(menu.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only update items of your own restaurant.',
      );
    }

    return item.update(dto);
  }

  async remove(id: number, user: User) {
    const item = await this.itemRepo.findByPk(id);
    if (!item) throw new NotFoundException('Menu item not found');

    const menu = await this.menuRepo.findByPk(item.menu_id);
    if (!menu) throw new NotFoundException('Menu not found');

    const restaurant = await this.restaurantRepo.findByPk(menu.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only delete items of your own restaurant.',
      );
    }

    await item.destroy();
    return { message: 'Menu item deleted successfully.' };
  }
}
