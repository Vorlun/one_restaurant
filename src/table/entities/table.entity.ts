import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

interface RestaurantTableCreationAttrs {
  restaurant_id: number;
  table_number: string;
  capacity: number;
  price?: number;
  is_available?: boolean;
  location_description?: string;
}

@Table({ tableName: 'tables', timestamps: true })
export class RestaurantTable extends Model<
  RestaurantTable,
  RestaurantTableCreationAttrs
> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ForeignKey(() => Restaurant)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare restaurant_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare table_number: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare capacity: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  declare price: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_available: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  declare location_description: string;

  @BelongsTo(() => Restaurant)
  restaurant: Restaurant;
}
