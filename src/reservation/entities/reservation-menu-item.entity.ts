import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { Reservation } from './reservation.entity';
import { MenuItem } from '../../menu_item/entities/menu_item.entity';

@Table({ tableName: 'reservation_menu_items', timestamps: false })
export class ReservationMenuItem extends Model {
  @ForeignKey(() => Reservation)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare reservation_id: number;
 
  @ForeignKey(() => MenuItem)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare menu_item_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare quantity: number;

  @BelongsTo(() => MenuItem, { foreignKey: 'menu_item_id', as: 'menu_item' })
  declare menu_item: MenuItem;

  @BelongsTo(() => Reservation, {
    foreignKey: 'reservation_id',
    as: 'reservation',
  })
  declare reservation: Reservation;
}
