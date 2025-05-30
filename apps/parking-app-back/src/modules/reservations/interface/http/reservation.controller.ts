import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ReservationCreationDto,
  ReservationResponseDto,
  CheckInReservationDto,
} from '../../application/dtos';
import {
  CheckInReservationUseCase,
  CreateReservationUseCase,
  GetReservationUseCase,
  GetReservationsByUserUseCase,
  GetReservationsUseCase,
} from '../../application/use-cases';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/application/dtos';
import { Role } from '@/modules/users/domain/value-objects/role.value-object';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly getReservationUseCase: GetReservationUseCase,
    private readonly getReservationsUseCase: GetReservationsUseCase,
    private readonly getReservationsByUserUseCase: GetReservationsByUserUseCase,
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

  @Get('all')
  @Roles(Role.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  getAllReservations(): Promise<ReservationResponseDto[]> {
    return this.getReservationsUseCase.execute();
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
  getReservationsForCurrentUser(
    @CurrentUser() payload: JwtPayload,
  ): Promise<ReservationResponseDto[]> {
    return this.getReservationsByUserUseCase.execute(payload);
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
