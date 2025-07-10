import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MenuImage } from './entities/menu_image.entity';
import { MenuItem } from '../menu_item/entities/menu_item.entity';
import { Menu } from '../menu/entities/menu.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { MenuImageService } from './menu_image.service';
import { MenuImageController } from './menu_image.controller';
import { JwtModule } from '@nestjs/jwt';
import { RestaurantsModule } from '../restaurant/restaurant.module';

@Module({
  imports: [
    SequelizeModule.forFeature([MenuImage, MenuItem, Menu, Restaurant]),
    JwtModule.register({}),
    RestaurantsModule,
  ],
  controllers: [MenuImageController],
  providers: [MenuImageService],
})
export class MenuImageModule {}
