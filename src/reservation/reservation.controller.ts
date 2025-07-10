import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationGuard } from '../common/guards/reservation.guard';
import { BaseAuthGuard } from '../common/guards/base-auth.guard';
import { AddMenuItemsDto } from './dto/add-menu-items.dto';

@ApiTags('Reservation')
@Controller('reservation')
@UseGuards(BaseAuthGuard, ReservationGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({ summary: 'Create reservation' })
  @ApiResponse({ status: 201, description: 'Reservation created' })
  create(@Body() dto: CreateReservationDto) {
    return this.reservationService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reservations' })
  findAll(@Req() req) {
    return this.reservationService.findAll(req.user);
  }

  @Get('approved/all')
  @ApiOperation({ summary: 'Get all approved reservations' })
  getApprovedReservations(@Req() req) {
    return this.reservationService.getApprovedReservations(req.user);
  }

  @Get('available/tables')
  @ApiOperation({ summary: 'Get available tables for reservation' })
  getAvailableTables(
    @Query('restaurant_id', ParseIntPipe) restaurant_id: number,
    @Query('reservation_date') reservation_date: string,
    @Query('reservation_time') reservation_time: string,
  ) {
    return this.reservationService.getAvailableTables(
      restaurant_id,
      reservation_date,
      reservation_time,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update reservation by ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, dto);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve reservation by manager' })
  approveReservation(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.update(id, { is_approved: true });
  }

  @Post(':id/add-menu-items')
  @ApiOperation({ summary: 'Add menu items to reservation' })
  addMenuItems(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddMenuItemsDto,
  ) {
    return this.reservationService.addMenuItemsToReservation(
      id,
      dto.menu_items,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete reservation by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.remove(id);
  }
}
