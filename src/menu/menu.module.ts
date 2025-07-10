import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Menu } from './entities/menu.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { JwtModule } from '@nestjs/jwt';
import { RestaurantsModule } from '../restaurant/restaurant.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Menu, Restaurant]),
    JwtModule.register({}), RestaurantsModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
