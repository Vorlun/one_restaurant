import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
  BelongsTo,
} from 'sequelize-typescript';
import { Reservation } from '../../reservation/entities/reservation.entity';

interface PaymentCreationAttrs {
  reservation_id: number;
  amount: number;
  payment_method: string;
  payment_status: string;
  paid_at?: Date;
}

@Table({ tableName: 'payments', timestamps: true })
export class Payment extends Model<Payment, PaymentCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Reservation)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare reservation_id: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare payment_method: string; // 'cash', 'card', 'online'

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare payment_status: string; // 'pending', 'paid', 'failed'

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare paid_at: Date;

  @BelongsTo(() => Reservation)
  reservation: Reservation;
}
