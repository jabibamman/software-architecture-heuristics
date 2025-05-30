import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max } from 'class-validator';
import { Min } from 'class-validator';

export class ManagerStatsDto {
  @ApiProperty({ description: 'Total number of parking slots', example: 60 })
  @IsNumber({}, { message: 'totalSlots must be a number' })
  @Min(0, { message: 'totalSlots must be at least 0' })
  totalSlots!: number;

  @ApiProperty({ description: 'Average occupancy percentage', example: 72 })
  @IsNumber({}, { message: 'avgOccupancyPct must be a number' })
  @Min(0, { message: 'avgOccupancyPct must be at least 0' })
  @Max(100, { message: 'avgOccupancyPct cannot exceed 100' })
  avgOccupancyPct!: number;

  @ApiProperty({ description: 'Percentage of no-shows', example: 8 })
  @IsNumber({}, { message: 'noShowPct must be a number' })
  @Min(0, { message: 'noShowPct must be at least 0' })
  @Max(100, { message: 'noShowPct cannot exceed 100' })
  noShowPct!: number;

  @ApiProperty({ description: 'Percentage of charger slots', example: 33 })
  @IsNumber({}, { message: 'chargerSlotsPct must be a number' })
  @Min(0, { message: 'chargerSlotsPct must be at least 0' })
  @Max(100, { message: 'chargerSlotsPct cannot exceed 100' })
  chargerSlotsPct!: number;

  @ApiProperty({
    description: 'Number of reservations last week',
    example: 215,
  })
  @IsNumber({}, { message: 'reservationsLastWeek must be a number' })
  @Min(0, { message: 'reservationsLastWeek must be at least 0' })
  reservationsLastWeek!: number;

  @ApiProperty({
    description: 'Number of reservations reserved today',
    example: 10,
  })
  reservedToday!: number;

  @ApiProperty({
    description: 'Number of reservations checked-in today',
    example: 5,
  })
  @IsNumber({}, { message: 'checkedInToday must be a number' })
  @Min(0, { message: 'checkedInToday must be at least 0' })
  checkedInToday!: number;
}
