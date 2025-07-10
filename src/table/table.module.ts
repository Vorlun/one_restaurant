import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { RestaurantTable } from './entities/table.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { JwtModule } from '@nestjs/jwt';
import { RestaurantsModule } from '../restaurant/restaurant.module';

@Module({
  imports: [
    SequelizeModule.forFeature([RestaurantTable, Restaurant]),
    JwtModule.register({}),
    RestaurantsModule,
  ],
  controllers: [TableController],
  providers: [TableService],
})
export class TableModule {}
