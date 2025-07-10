import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './entities/payment.entity';
import { Reservation } from '../reservation/entities/reservation.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Payment, Reservation]),JwtModule.register({})],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
