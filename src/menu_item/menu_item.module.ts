import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MenuItem } from './entities/menu_item.entity';
import { Menu } from '../menu/entities/menu.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { MenuItemService } from './menu_item.service';
import { MenuItemController } from './menu_item.controller';
import { JwtModule } from '@nestjs/jwt';
import { RestaurantsModule } from '../restaurant/restaurant.module';

@Module({
  imports: [
    SequelizeModule.forFeature([MenuItem, Menu, Restaurant]),
    JwtModule.register({}),
    RestaurantsModule,
  ],
  controllers: [MenuItemController],
  providers: [MenuItemService],
})
export class MenuItemModule {}
