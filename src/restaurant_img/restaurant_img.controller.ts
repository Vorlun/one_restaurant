import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BaseAuthGuard } from '../common/guards/base-auth.guard';
import { RestaurantGuard } from '../common/guards/restaurant.guard';
import { RestaurantImgService } from './restaurant_img.service';
import { CreateRestaurantImgDto } from './dto/create-restaurant_img.dto';
import { UpdateRestaurantImgDto } from './dto/update-restaurant_img.dto';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Restaurant Images')
@ApiBearerAuth()
@Controller('restaurant-img')
@UseGuards(BaseAuthGuard, RestaurantGuard)
export class RestaurantImgController {
  constructor(private readonly restaurantImgService: RestaurantImgService) {}

  @Post()
  @ApiOperation({ summary: 'Create a restaurant image' })
  create(
    @Body() dto: CreateRestaurantImgDto,
    @Req() req: Request & { user: any },
  ) {
    return this.restaurantImgService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all restaurant images' })
  findAll(@Req() req: Request & { user: any }) {
    return this.restaurantImgService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant image by ID' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: any },
  ) {
    return this.restaurantImgService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update restaurant image by ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRestaurantImgDto,
    @Req() req: Request & { user: any },
  ) {
    return this.restaurantImgService.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete restaurant image by ID' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: any },
  ) {
    return this.restaurantImgService.remove(id, req.user);
  }
}
