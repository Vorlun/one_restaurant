import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  menu_id: number;

  @ApiProperty({ example: 'Cheeseburger' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'http://...' })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiProperty({ example: 'Delicious cheeseburger', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 9.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_available?: boolean;
}
