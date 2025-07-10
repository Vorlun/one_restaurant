import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMenuImageDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  menu_item_id: number;

  @ApiProperty({ example: 'https://...' })
  @IsString()
  @IsNotEmpty()
  image_url: string;
}
