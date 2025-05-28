import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ReservationCreationDto,
  ReservationResponseDto,
} from '../../application/dtos';
import {
  CreateReservationUseCase,
  GetReservationUseCase,
  GetReservationsUseCase,
} from '../../application/use-cases';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly getReservationUseCase: GetReservationUseCase,
    private readonly getReservationsUseCase: GetReservationsUseCase,

    // private readonly checkInReservationUseCase: CheckInReservationUseCase,
    // private readonly releaseExpiredReservationUseCase: ReleaseExpiredReservationUseCase,
  ) {}

  @Post()
  createReservation(
    @Body() reservationDto: ReservationCreationDto,
  ): Promise<ReservationResponseDto> {
    return this.createReservationUseCase.execute(reservationDto);
  }

  @Get(':id')
  getReservation(@Param('id') id: string): Promise<ReservationResponseDto> {
    return this.getReservationUseCase.execute(id);
  }

  @Get()
  getReservations(): Promise<ReservationResponseDto[]> {
    return this.getReservationsUseCase.execute();
  }
}
