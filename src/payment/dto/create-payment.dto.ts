import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  reservation_id: number;

  @ApiProperty({ example: 100.5 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'card' })
  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @ApiProperty({ example: 'paid' })
  @IsString()
  @IsNotEmpty()
  payment_status: string;

  @ApiProperty({ example: '2025-07-08T12:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  paid_at?: Date;
}
