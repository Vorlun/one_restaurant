import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { RestaurantTable } from '../../table/entities/table.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { User } from '../../users/entities/user.entity';
import { MenuItem } from '../../menu_item/entities/menu_item.entity';
import { ReservationMenuItem } from './reservation-menu-item.entity';

interface ReservationCreationAttrs {
  table_id: number;
  restaurant_id: number;
  user_id: number;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  status?: string;
  special_request?: string;
  is_approved?: boolean;
  total_price?: number;
}

@Table({ tableName: 'reservations', timestamps: true })
export class Reservation extends Model<Reservation, ReservationCreationAttrs> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ForeignKey(() => RestaurantTable)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare table_id: number;

  @ForeignKey(() => Restaurant)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare restaurant_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare reservation_date: string;

  @Column({ type: DataType.TIME, allowNull: false })
  declare reservation_time: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare guest_count: number;

  @Column({ type: DataType.STRING, defaultValue: 'pending' })
  declare status: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare special_request: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_approved: boolean;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  declare total_price: number;

  @BelongsTo(() => RestaurantTable) table: RestaurantTable;
  @BelongsTo(() => Restaurant) restaurant: Restaurant;
  @BelongsTo(() => User) user: User;

  @BelongsToMany(() => MenuItem, {
    through: () => ReservationMenuItem,
    foreignKey: 'reservation_id',
    otherKey: 'menu_item_id',
  })
  menu_items: MenuItem[];
}
