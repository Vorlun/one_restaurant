import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantImgDto } from './create-restaurant_img.dto';

export class UpdateRestaurantImgDto extends PartialType(CreateRestaurantImgDto) {}
