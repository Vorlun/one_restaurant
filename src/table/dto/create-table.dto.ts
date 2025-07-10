import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreateTableDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  restaurant_id: number;

  @ApiProperty({ example: 'T1' })
  @IsString()
  @IsNotEmpty()
  table_number: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_available?: boolean;

  @ApiProperty({ example: 'Near the window', required: false })
  @IsString()
  @IsOptional()
  location_description?: string;

  @ApiProperty({ example: '15.00', required: false })
  @IsNumber()
  @IsOptional()
  price?:number;
}
