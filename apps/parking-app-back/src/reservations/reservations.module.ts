import { Module } from '@nestjs/common';
import { ReservationController } from './interface/http/reservation.controller';
import {
  CheckInReservationUseCase,
  CreateReservationUseCase,
  ReleaseExpiredReservationUseCase,
} from './application/use-cases';

@Module({
  imports: [
    // TypeOrmModule.forFeature([Reservation]),
    // TypeOrmModule.forFeature([ParkingSlot]),
  ],
  controllers: [ReservationController],
  providers: [
    CheckInReservationUseCase,
    CreateReservationUseCase,
    ReleaseExpiredReservationUseCase,
  ],
  exports: [],
})
export class ReservationsModule {}
