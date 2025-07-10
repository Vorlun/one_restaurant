import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';

interface RestaurantCreationAttrs {
  name: string;
  address: string;
  phone_number: string;
  description?: string;
  manager_id?: number;
  is_active?: boolean;
}

@Table({ tableName: 'restaurants', timestamps: true })
export class Restaurant extends Model<Restaurant, RestaurantCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone_number: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare manager_id: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare is_active: boolean;

  @BelongsTo(() => User)
  manager: User;

  @HasMany(() => Reservation)
  reservations: Reservation[];
}
