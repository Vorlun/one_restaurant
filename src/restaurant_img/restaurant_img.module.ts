import { Module } from '@nestjs/common';
import { RestaurantImgService } from './restaurant_img.service';
import { RestaurantImgController } from './restaurant_img.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { RestaurantImg } from './entities/restaurant_img.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { RestaurantsModule } from '../restaurant/restaurant.module';

@Module({
  imports: [
    SequelizeModule.forFeature([RestaurantImg, Restaurant]),
    JwtModule.register({}),
    UsersModule,
    RestaurantsModule,
  ],
  controllers: [RestaurantImgController],
  providers: [RestaurantImgService],
})
export class RestaurantImgModule {}
