import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { RestaurantTable } from '../table/entities/table.entity';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { MenuItem } from '../menu_item/entities/menu_item.entity';
import { ReservationMenuItem } from './entities/reservation-menu-item.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Reservation,
      Restaurant,
      RestaurantTable,
      User,
      MenuItem,
      ReservationMenuItem,
    ]),
    JwtModule.register({}),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
