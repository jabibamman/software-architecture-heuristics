import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  Matches,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsUUID,
} from 'class-validator';

const SLOT_ID_REGEX = /^[A-F](0[1-9]|10)$/;

export class SlotDto {
  @ApiProperty({
    example: 'A01',
    description: 'Identifier of the slot (row A–F, 01–10)',
  })
  @IsString()
  @Matches(SLOT_ID_REGEX, {
    message: 'id must match rows A–F and numbers 01–10, e.g. A01',
  })
  id!: string;

  @ApiProperty({
    example: false,
    description: 'Whether the slot is fully reserved',
  })
  @IsBoolean()
  reserved!: boolean;

  @ApiPropertyOptional({
    example: '2025-05-30T08:00:00Z',
    description: 'Start time of the reservation (ISO 8601)',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'reservationStart must be a valid ISO date string' },
  )
  reservationStart?: string;

  @ApiPropertyOptional({
    example: '2025-05-30T18:00:00Z',
    description: 'End time of the reservation (ISO 8601)',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'reservationEnd must be a valid ISO date string' },
  )
  reservationEnd?: string;

  @ApiPropertyOptional({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'User ID who holds the reservation',
  })
  @IsOptional()
  @IsUUID('4', { message: 'reservedBy must be a valid UUIDv4' })
  reservedBy?: string;
}
