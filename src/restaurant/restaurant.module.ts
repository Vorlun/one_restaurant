import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurant.service';
import { RestaurantsController } from './restaurant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Restaurant } from './entities/restaurant.entity';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([Restaurant]),
    UsersModule,
    JwtModule.register({}),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
