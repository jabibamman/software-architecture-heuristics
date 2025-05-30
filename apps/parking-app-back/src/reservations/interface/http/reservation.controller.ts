import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/auth/application/dtos/jwt-payload';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly getReservationUseCase: GetReservationUseCase,
    private readonly getReservationsUseCase: GetReservationsUseCase,

    private readonly checkInReservationUseCase: CheckInReservationUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createReservation(
    @CurrentUser() user: JwtPayload,
    @Body() reservationDto: ReservationCreationDto,
  ): Promise<ReservationResponseDto> {
    return this.createReservationUseCase.execute(reservationDto, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getReservation(@Param('id') id: string): Promise<ReservationResponseDto> {
    return this.getReservationUseCase.execute(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getReservations(): Promise<ReservationResponseDto[]> {
    return this.getReservationsUseCase.execute();
  }

  @Post(':id/checkin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  checkInReservation(
    @CurrentUser() payload: JwtPayload,
    @Body() dto: CheckInReservationDto,
  ): Promise<ReservationResponseDto> {
    return this.checkInReservationUseCase.execute(dto, payload);
  }
}
