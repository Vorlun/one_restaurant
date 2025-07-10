import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Oqtepa Lavash', description: 'Restaurant name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Yunusobod, Tashkent', description: 'Address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '+998901234567', description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    example: 'Fast food restaurant',
    description: 'Optional description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 3,
    description: 'Manager user ID (optional)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  manager_id?: number;

  @ApiProperty({
    example: true,
    description: 'Active status (optional)',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
