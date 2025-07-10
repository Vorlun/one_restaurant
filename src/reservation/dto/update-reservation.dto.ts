import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @ApiPropertyOptional({
    example: true,
    description: 'Manager approval status',
  })
  @IsBoolean()
  @IsOptional()
  is_approved?: boolean; 
}
