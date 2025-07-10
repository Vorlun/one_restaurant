import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { RestaurantsModule } from './restaurant/restaurant.module';
import { Restaurant } from './restaurant/entities/restaurant.entity';
import { RestaurantImgModule } from './restaurant_img/restaurant_img.module';
import { RestaurantImg } from './restaurant_img/entities/restaurant_img.entity';
import { MenuModule } from './menu/menu.module';
import { MenuItemModule } from './menu_item/menu_item.module';
import { MenuImageModule } from './menu_image/menu_image.module';
import { Menu } from './menu/entities/menu.entity';
import { MenuImage } from './menu_image/entities/menu_image.entity';
import { MenuItem } from './menu_item/entities/menu_item.entity';
import { TableModule } from './table/table.module';
import { ReservationModule } from './reservation/reservation.module';
import { PaymentModule } from './payment/payment.module';
import { RestaurantTable } from './table/entities/table.entity';
import { Reservation } from './reservation/entities/reservation.entity';
import { Payment } from './payment/entities/payment.entity';
import { ReservationMenuItem } from './reservation/entities/reservation-menu-item.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      models: [
        User,
        Restaurant,
        RestaurantImg,
        Menu,
        MenuImage,
        MenuItem,
        RestaurantTable,
        Reservation,
        Payment,
        ReservationMenuItem
      ],
      autoLoadModels: true,
      logging: false,
      sync: { alter: true },
    }),

    UsersModule,

    AuthModule,

    RestaurantsModule,

    RestaurantImgModule,

    MenuModule,

    MenuItemModule,

    MenuImageModule,

    TableModule,

    ReservationModule,

    PaymentModule,
  ],
})
export class AppModule {}
