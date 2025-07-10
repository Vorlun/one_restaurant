import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MenuImage } from './entities/menu_image.entity';
import { CreateMenuImageDto } from './dto/create-menu_image.dto';
import { UpdateMenuImageDto } from './dto/update-menu_image.dto';
import { MenuItem } from '../menu_item/entities/menu_item.entity';
import { Menu } from '../menu/entities/menu.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MenuImageService {
  constructor(
    @InjectModel(MenuImage) private imageRepo: typeof MenuImage,
    @InjectModel(MenuItem) private menuItemRepo: typeof MenuItem,
    @InjectModel(Menu) private menuRepo: typeof Menu,
    @InjectModel(Restaurant) private restaurantRepo: typeof Restaurant,
  ) {}

  async create(dto: CreateMenuImageDto, user: User) {
    const menuItem = await this.menuItemRepo.findByPk(dto.menu_item_id);
    if (!menuItem) throw new NotFoundException('Menu item not found');

    const menu = await this.menuRepo.findByPk(menuItem.menu_id);
    if (!menu) throw new NotFoundException('Menu not found');

    const restaurant = await this.restaurantRepo.findByPk(menu.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only add images to your own restaurant menu items.',
      );
    }

    return this.imageRepo.create(dto);
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

      const menuItems = await this.menuItemRepo.findAll({
        where: { menu_id: menuIds },
      });
      const menuItemIds = menuItems.map((mi) => mi.id);

      return this.imageRepo.findAll({
        where: { menu_item_id: menuItemIds },
        include: [{ model: MenuItem }],
      });
    }

    return this.imageRepo.findAll({
      include: [{ model: MenuItem }],
    });
  }

  async findOne(id: number, user: User) {
    const image = await this.imageRepo.findByPk(id, {
      include: [{ model: MenuItem }],
    });
    if (!image) throw new NotFoundException('Menu image not found');

    const menuItem = await this.menuItemRepo.findByPk(image.menu_item_id);
    if (!menuItem) throw new NotFoundException('Menu item not found');

    const menu = await this.menuRepo.findByPk(menuItem.menu_id);
    if (!menu) throw new NotFoundException('Menu not found');

    const restaurant = await this.restaurantRepo.findByPk(menu.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only view images of your own restaurant menu items.',
      );
    }

    return image;
  }

  async update(id: number, dto: UpdateMenuImageDto, user: User) {
    const image = await this.imageRepo.findByPk(id);
    if (!image) throw new NotFoundException('Menu image not found');

    const menuItem = await this.menuItemRepo.findByPk(image.menu_item_id);
    if (!menuItem) throw new NotFoundException('Menu item not found');

    const menu = await this.menuRepo.findByPk(menuItem.menu_id);
    if (!menu) throw new NotFoundException('Menu not found');

    const restaurant = await this.restaurantRepo.findByPk(menu.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only update images of your own restaurant menu items.',
      );
    }

    return image.update(dto);
  }

  async remove(id: number, user: User) {
    const image = await this.imageRepo.findByPk(id);
    if (!image) throw new NotFoundException('Menu image not found');

    const menuItem = await this.menuItemRepo.findByPk(image.menu_item_id);
    if (!menuItem) throw new NotFoundException('Menu item not found');

    const menu = await this.menuRepo.findByPk(menuItem.menu_id);
    if (!menu) throw new NotFoundException('Menu not found');

    const restaurant = await this.restaurantRepo.findByPk(menu.restaurant_id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (user.role === 'manager' && restaurant.manager_id !== user.id) {
      throw new ForbiddenException(
        'You can only delete images of your own restaurant menu items.',
      );
    }

    await image.destroy();
    return { message: 'Menu image deleted successfully.' };
  }
}
