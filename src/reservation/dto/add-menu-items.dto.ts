import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty } from 'class-validator';

export class AddMenuItemsDto {
  @ApiProperty({
    example: [
      [1, 2],
      [3, 1],
    ],
    description: 'Array of [menu_item_id, quantity] pairs',
  })
  @IsArray()
  @ArrayNotEmpty()
  menu_items: [number, number][];
}
