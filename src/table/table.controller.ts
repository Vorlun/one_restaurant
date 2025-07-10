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
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { BaseAuthGuard } from '../common/guards/base-auth.guard';
import { RestaurantGuard } from '../common/guards/restaurant.guard';
import { Request } from 'express';

@ApiTags('Restaurant Tables')
@Controller('table')
@UseGuards(BaseAuthGuard, RestaurantGuard)
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  @ApiOperation({ summary: 'Create restaurant table' })
  @ApiResponse({ status: 201, description: 'Table created' })
  create(@Body() dto: CreateTableDto, @Req() req: Request & { user: any }) {
    return this.tableService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tables' })
  findAll(@Req() req: Request & { user: any }) {
    return this.tableService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get table by ID' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: any },
  ) {
    return this.tableService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update table by ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTableDto,
    @Req() req: Request & { user: any },
  ) {
    return this.tableService.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete table by ID' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: any },
  ) {
    return this.tableService.remove(id, req.user);
  }
}
