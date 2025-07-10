import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  table_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  restaurant_id: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ example: '2025-07-10' })
  @IsDateString()
  @IsNotEmpty()
  reservation_date: string;

  @ApiProperty({ example: '18:30:00' })
  @IsString()
  @IsNotEmpty()
  reservation_time: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @IsNotEmpty()
  guest_count: number;

  @ApiProperty({ example: 'Birthday table', required: false })
  @IsString()
  @IsOptional()
  special_request?: string;

  @ApiProperty({
    example: [
      [1, 2], 
      [3, 1],
    ],
    description: 'Array of [menu_item_id, quantity] pairs',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  menu_items?: [number, number][];
}
