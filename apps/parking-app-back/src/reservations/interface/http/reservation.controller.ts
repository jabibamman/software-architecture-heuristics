import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ReservationCreationDto,
  ReservationResponseDto,
} from '../../application/dtos';
import {
  CheckInReservationUseCase,
  CreateReservationUseCase,
  GetReservationUseCase,
  GetReservationsUseCase,
} from '../../application/use-cases';
import { CheckInReservationDto } from '../../application/dtos/checkin-reservation.dto';
import { User } from '@/users/domain/entities/user.entity';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly getReservationUseCase: GetReservationUseCase,
    private readonly getReservationsUseCase: GetReservationsUseCase,

    private readonly checkInReservationUseCase: CheckInReservationUseCase,
  ) {}

  @Post()
  createReservation(
    @Body() reservationDto: ReservationCreationDto,
  ): Promise<ReservationResponseDto> {
    const dummyUser = new User();
    dummyUser.id = '00000000-0000-0000-0000-000000000000';
    // TODO: remove dummyUser when auth is implemented
    return this.createReservationUseCase.execute(reservationDto, dummyUser);
  }

  @Get(':id')
  getReservation(@Param('id') id: string): Promise<ReservationResponseDto> {
    return this.getReservationUseCase.execute(id);
  }

  @Get()
  getReservations(): Promise<ReservationResponseDto[]> {
    return this.getReservationsUseCase.execute();
  }

  @Post(':id/checkin')
  checkInReservation(
    @Body() dto: CheckInReservationDto,
  ): Promise<ReservationResponseDto> {
    const dummy = new User();
    dummy.id = '00000000-0000-0000-0000-000000000000';
    // TODO: remove dummyUser when auth is implemented
    return this.checkInReservationUseCase.execute(dto, dummy);
  }
}
