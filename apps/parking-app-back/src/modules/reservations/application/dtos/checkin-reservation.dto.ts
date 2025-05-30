import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckInReservationDto {
  @ApiProperty({
    description: 'ID de la réservation à checker',
    example: 'uuid-v4',
  })
  @IsUUID('4', { message: 'id must be a valid UUIDv4' })
  id!: string;
}
