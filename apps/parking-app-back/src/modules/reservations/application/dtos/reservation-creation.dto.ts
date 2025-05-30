import {
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReservationCreationDto {
  @ApiProperty({
    description: 'The slot ID (e.g. A01)',
    example: 'A01',
    pattern: '^[A-F](0[1-9]|10)$',
  })
  @IsString()
  @Matches(/^[A-F](0[1-9]|10)$/, {
    message: 'slotId must be letter A–F + 01–10, e.g. A01',
  })
  slotId!: string;

  @ApiProperty({
    description: 'The start date (ISO format)',
    example: '2025-05-28T10:00:00Z',
  })
  @IsDateString({}, { message: 'startDate must be a valid ISO date' })
  startDate!: string;

  @ApiProperty({
    description: 'The end date (ISO format)',
    example: '2025-05-28T12:00:00Z',
  })
  @IsDateString({}, { message: 'endDate must be a valid ISO date' })
  endDate!: string;

  @ApiProperty({
    description: 'Whether the car needs a charger',
    example: true,
  })
  @IsBoolean({ message: 'needsCharger must be a boolean' })
  @Type(() => Boolean)
  needsCharger!: boolean;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Corner spot preferred',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'notes must be a string' })
  @Length(0, 255, { message: 'notes cannot exceed 255 characters' })
  notes?: string;
}
