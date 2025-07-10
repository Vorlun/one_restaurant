import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  restaurant_id: number;

  @ApiProperty({ example: 'Lunch Specials' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Special lunch options', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
