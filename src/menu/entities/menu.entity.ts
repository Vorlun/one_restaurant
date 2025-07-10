import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

interface MenuCreationAttrs {
  restaurant_id: number;
  name: string;
  description?: string;
}

@Table({ tableName: 'menus', timestamps: true })
export class Menu extends Model<Menu, MenuCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Restaurant)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare restaurant_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @BelongsTo(() => Restaurant)
  restaurant: Restaurant;
}
