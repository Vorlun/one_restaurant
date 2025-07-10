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
import { MenuItemService } from './menu_item.service';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { Request } from 'express';

@ApiTags('Menu Item')
@Controller('menu-item')
@UseGuards(BaseAuthGuard, RestaurantGuard)
export class MenuItemController {
  constructor(private readonly itemService: MenuItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create menu item' })
  @ApiResponse({ status: 201, description: 'Menu item created' })
  create(@Body() dto: CreateMenuItemDto, @Req() req: Request & { user: any }) {
    return this.itemService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menu items' })
  findAll(@Req() req: Request & { user: any }) {
    return this.itemService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu item by ID' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: any },
  ) {
    return this.itemService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update menu item by ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMenuItemDto,
    @Req() req: Request & { user: any },
  ) {
    return this.itemService.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete menu item by ID' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: any },
  ) {
    return this.itemService.remove(id, req.user);
  }
}
