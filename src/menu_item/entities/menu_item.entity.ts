import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Menu } from '../../menu/entities/menu.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { ReservationMenuItem } from '../../reservation/entities/reservation-menu-item.entity';

interface MenuItemCreationAttrs {
  menu_id: number;
  name: string;
  cover?: string;
  description?: string;
  price: number;
  is_available?: boolean;
}

@Table({ tableName: 'menu_items', timestamps: true })
export class MenuItem extends Model<MenuItem, MenuItemCreationAttrs> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ForeignKey(() => Menu)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare menu_id: number;

  @BelongsTo(() => Menu) menu: Menu;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare cover: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare is_available: boolean;

  @BelongsToMany(() => Reservation, {
    through: () => ReservationMenuItem,
    foreignKey: 'menu_item_id',
    otherKey: 'reservation_id',
  })
  reservations: Reservation[];

  @HasMany(() => ReservationMenuItem, { foreignKey: 'menu_item_id' })
  reservation_menu_items: ReservationMenuItem[];
}
