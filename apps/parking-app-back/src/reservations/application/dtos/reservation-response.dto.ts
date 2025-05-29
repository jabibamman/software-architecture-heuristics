import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Reservation } from '../../domain/entities/reservation.entity';

export class ReservationResponseDto {
  @ApiProperty({ description: 'The reservation ID', example: 'uuid-v4' })
  @IsString()
  id!: string;

  @ApiProperty({ description: 'The slot ID', example: 'A01' })
  @IsString()
  slotId!: string;

  @ApiProperty({
    description: 'The start date',
    example: '2025-05-28T10:00:00Z',
  })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ description: 'The end date', example: '2025-05-28T12:00:00Z' })
  @IsDateString()
  endDate!: string;

  @ApiProperty({
    description: 'Whether the car needs a charger',
    example: true,
  })
  @IsBoolean()
  needsCharger!: boolean;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Check-in status', example: false })
  @IsBoolean()
  checkedIn!: boolean;

  @ApiProperty({ description: 'Check-in timestamp (ISO)', required: false })
  @IsOptional()
  @IsDateString()
  checkedInAt?: string;

  @ApiProperty({
    description: 'Creation timestamp (ISO)',
    example: '2025-05-28T10:00:00Z',
  })
  @IsDateString()
  createdAt!: string;

  @ApiProperty({
    description: 'Last update timestamp (ISO)',
    example: '2025-05-28T11:00:00Z',
  })
  @IsDateString()
  updatedAt!: string;

  static fromEntity(entity: Reservation): ReservationResponseDto {
    return {
      id: entity.id,
      slotId: entity.slotId,
      startDate: entity.startDate.toISOString(),
      endDate: entity.endDate.toISOString(),
      needsCharger: entity.needsCharger,
      checkedIn: entity.checkedIn,
      checkedInAt: entity.checkedInAt?.toISOString(),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
