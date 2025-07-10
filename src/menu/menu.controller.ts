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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Request } from 'express';

@ApiTags('Menu')
@Controller('menu')
@UseGuards(BaseAuthGuard, RestaurantGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: 'Create menu' })
  @ApiResponse({ status: 201, description: 'Menu created' })
  create(@Body() dto: CreateMenuDto, @Req() req: Request & { user: any }) {
    return this.menuService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menus' })
  findAll(@Req() req: Request & { user: any }) {
    return this.menuService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu by ID' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: any },
  ) {
    return this.menuService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update menu by ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMenuDto,
    @Req() req: Request & { user: any },
  ) {
    return this.menuService.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete menu by ID' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: any },
  ) {
    return this.menuService.remove(id, req.user);
  }
}
