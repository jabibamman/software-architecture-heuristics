import { Module } from '@nestjs/common';
import { ReservationController } from './interface/http/reservation.controller';
import {
  CheckInReservationUseCase,
  CreateReservationUseCase,
  ReleaseExpiredReservationUseCase,
  useCases,
} from './application/use-cases';
import { Reservation } from './domain/entities/reservation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmReservationRepository } from './infrastructure/repositories/typeorm-reservation.repository';
//import { ParkingSlot } from './domain/entities/parking-slot';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation /*ParkingSlot*/])],
  controllers: [ReservationController],
  providers: [
    ...useCases,
    {
      provide: 'ReservationRepositoryPort',
      useClass: TypeOrmReservationRepository,
    },
  ],
  exports: [],
})
export class ReservationsModule {}
