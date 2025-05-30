import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '@/modules/reservations/domain/entities/reservation.entity';
import { SlotsController } from './interface/http/slots.controller';
import { TypeOrmReservationRepository } from '@/modules/reservations/infrastructure/repositories/typeorm-reservation.repository';
import { GetSlotsStatusUseCase } from './application/use-cases/get-slots-status.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation])],
  controllers: [SlotsController],
  providers: [
    {
      provide: 'ReservationRepositoryPort',
      useClass: TypeOrmReservationRepository,
    },
    GetSlotsStatusUseCase,
  ],
})
export class ParkingModule {}
