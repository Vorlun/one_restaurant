import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRestaurantImgDto {
  @ApiProperty({ example: 1, description: 'Restaurant ID' })
  @IsNumber()
  @IsNotEmpty()
  restaurant_id: number;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Image URL',
  })
  @IsString()
  @IsNotEmpty()
  image_url: string;

  @ApiProperty({
    example: true,
    description: 'Is primary image',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;
}
