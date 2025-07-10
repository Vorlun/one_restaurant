import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './entities/payment.entity';
import { Reservation } from '../reservation/entities/reservation.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment) private paymentRepo: typeof Payment,
    @InjectModel(Reservation) private reservationRepo: typeof Reservation,
    private sequelize: Sequelize,
  ) {}

  async create(dto: CreatePaymentDto) {
    return this.sequelize.transaction(async (transaction) => {
      const reservation = await this.reservationRepo.findByPk(
        dto.reservation_id,
        { transaction },
      );
      if (!reservation) throw new NotFoundException('Reservation not found');

      if (reservation.status === 'cancelled') {
        throw new BadRequestException(
          'Cannot pay for a cancelled reservation.',
        );
      }

      if (dto.amount <= 0) {
        throw new BadRequestException(
          'Payment amount must be greater than zero.',
        );
      }

      if (dto.amount > Number(reservation.total_price)) {
        throw new BadRequestException(
          'Payment amount exceeds reservation total price.',
        );
      }

      if (dto.payment_status === 'paid' && !dto.paid_at) {
        dto.paid_at = new Date();
      }

      // Reservation summasidan kamaytirish
      const newTotalPrice = Number(reservation.total_price) - dto.amount;
      reservation.total_price = +newTotalPrice.toFixed(2);

      // Agar to‘liq to‘langan bo‘lsa, status completed bo‘ladi
      if (reservation.total_price <= 0) {
        reservation.status = 'completed';
        reservation.total_price = 0;
      }

      await reservation.save({ transaction });

      const payment = await this.paymentRepo.create(dto, { transaction });

      return payment;
    });
  }

  async findAll() {
    return this.paymentRepo.findAll({
      include: [{ model: Reservation }],
    });
  }

  async findOne(id: number) {
    const payment = await this.paymentRepo.findByPk(id, {
      include: [{ model: Reservation }],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async update(id: number, dto: UpdatePaymentDto) {
    const payment = await this.paymentRepo.findByPk(id);
    if (!payment) throw new NotFoundException('Payment not found');

    if (dto.payment_status === 'paid' && !dto.paid_at) {
      dto.paid_at = new Date();
    }

    return payment.update(dto);
  }

  async remove(id: number) {
    const payment = await this.paymentRepo.findByPk(id);
    if (!payment) throw new NotFoundException('Payment not found');
    await payment.destroy();
    return { message: 'Payment deleted successfully.' };
  }
}
