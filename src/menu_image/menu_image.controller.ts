import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseAuthGuard } from '../common/guards/base-auth.guard';
import { RestaurantGuard } from '../common/guards/restaurant.guard';
import { MenuImageService } from './menu_image.service';
import { CreateMenuImageDto } from './dto/create-menu_image.dto';
import { UpdateMenuImageDto } from './dto/update-menu_image.dto';
import { Request } from 'express';

@ApiTags('Menu Image')
@Controller('menu-image')
@UseGuards(BaseAuthGuard, RestaurantGuard)
export class MenuImageController {
  constructor(private readonly imageService: MenuImageService) {}

  @Post()
  @ApiOperation({ summary: 'Create menu image' })
  @ApiResponse({ status: 201, description: 'Menu image created' })
  create(@Body() dto: CreateMenuImageDto, @Req() req: Request & { user: any }) {
    return this.imageService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menu images' })
  findAll(@Req() req: Request & { user: any }) {
    return this.imageService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu image by ID' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: any },
  ) {
    return this.imageService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update menu image by ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMenuImageDto,
    @Req() req: Request & { user: any },
  ) {
    return this.imageService.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete menu image by ID' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: any },
  ) {
    return this.imageService.remove(id, req.user);
  }
}
