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
import { RestaurantsService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { BaseAuthGuard } from '../common/guards/base-auth.guard';
import { RestaurantGuard } from '../common/guards/restaurant.guard';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Restaurant')
@Controller('restaurant')
@UseGuards(BaseAuthGuard, RestaurantGuard)
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'Restaurant created successfully' })
  create(
    @Body() dto: CreateRestaurantDto,
    @Req() req: Request & { user: any },
  ) {
    return this.restaurantsService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiResponse({ status: 200, description: 'List of restaurants' })
  findAll(@Req() req: Request & { user?: any }) {
    return this.restaurantsService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Restaurant found' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user?: any },
  ) {
    return this.restaurantsService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update restaurant by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Restaurant updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRestaurantDto,
    @Req() req: Request & { user: any },
  ) {
    return this.restaurantsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete restaurant by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Restaurant deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.remove(id);
  }
}
