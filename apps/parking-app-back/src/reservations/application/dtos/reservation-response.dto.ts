import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';
import { IsBoolean } from 'class-validator';

export class ReservationResponseDto {
  @ApiProperty({
    description: 'The reservation ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  id!: string;
  @ApiProperty({
    description: 'The slot ID',
    example: 'A01',
  })
  @IsString()
  slotId!: string;

  @ApiProperty({
    description: 'The start date',
    example: '2025-05-28T10:00:00Z',
  })
  @IsDateString()
  startDate!: string;

  @ApiProperty({
    description: 'The end date',
    example: '2025-05-28T12:00:00Z',
  })
  @IsDateString()
  endDate!: string;

  @ApiProperty({
    description: 'Whether the car needs a charger',
    example: true,
  })
  @IsBoolean()
  needsCharger!: boolean;

  @ApiProperty({
    description: 'The creation date',
    example: '2025-05-28T10:00:00Z',
  })
  @IsDateString()
  createdAt!: string;
}
