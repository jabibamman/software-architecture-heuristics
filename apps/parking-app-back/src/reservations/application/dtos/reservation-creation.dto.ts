import {
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReservationCreationDto {
  @ApiProperty({
    description: 'The slot ID (e.g. A01)',
    example: 'A01',
    pattern: '^[A-Z][0-9]{2}$',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @Length(2, 3, { message: 'slotId must be row letter + number, e.g. A01' })
  slotId!: string;

  @ApiProperty({
    description: 'The start date (ISO format)',
    example: '2025-05-28T10:00:00Z',
  })
  @IsDateString({}, { message: 'startDate must be a valid ISO date string' })
  startDate!: string;

  @ApiProperty({
    description: 'The end date (ISO format)',
    example: '2025-05-28T12:00:00Z',
  })
  @IsDateString({}, { message: 'endDate must be a valid ISO date string' })
  endDate!: string;

  @ApiProperty({
    description: 'Whether the car needs a charger',
    example: true,
  })
  @IsBoolean({ message: 'needsCharger must be true or false' })
  @Type(() => Boolean)
  needsCharger!: boolean;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Needs a specific parking spot',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(0, 255, { message: 'notes cannot exceed 255 characters' })
  notes?: string;
}
