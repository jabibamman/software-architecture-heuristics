import { Body, Controller, Post } from '@nestjs/common';
import {
  ReservationCreationDto,
  ReservationResponseDto,
} from '../../application/dtos';
import { CreateReservationUseCase } from '../../application/use-cases';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
  ) {}

  @Post()
  createReservation(
    @Body() reservationDto: ReservationCreationDto,
  ): Promise<ReservationResponseDto> {
    return this.createReservationUseCase.execute(reservationDto);
  }
}
