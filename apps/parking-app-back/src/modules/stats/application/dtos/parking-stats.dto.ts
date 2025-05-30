import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class ParkingStatsDto {
  @ApiProperty({ description: 'Total number of parking slots', example: 60 })
  @IsNumber({}, { message: 'totalSlots must be a number' })
  @Min(0, { message: 'totalSlots must be at least 0' })
  totalSlots!: number;

  @ApiProperty({ description: 'Number of slots reserved today', example: 20 })
  @IsNumber({}, { message: 'reservedToday must be a number' })
  @Min(0, { message: 'reservedToday must be at least 0' })
  reservedToday!: number;

  @ApiProperty({ description: 'Number of slots checked-in today', example: 15 })
  @IsNumber({}, { message: 'checkedInToday must be a number' })
  @Min(0, { message: 'checkedInToday must be at least 0' })
  checkedInToday!: number;

  @ApiProperty({ description: 'Percentage of charger usage', example: 30 })
  @IsNumber({}, { message: 'chargerUsagePct must be a number' })
  @Min(0, { message: 'chargerUsagePct must be at least 0' })
  @Max(100, { message: 'chargerUsagePct cannot exceed 100' })
  chargerUsagePct!: number;
}
