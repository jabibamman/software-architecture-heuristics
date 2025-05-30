import { Module } from '@nestjs/common';
import { ReservationController } from './interface/http/reservation.controller';
import { useCases } from './application/use-cases';
import { Reservation } from './domain/entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmReservationRepository } from './infrastructure/repositories/typeorm-reservation.repository';

import { ReleaseExpiredJob } from './interface/cron/release-expired.job';
import { UsersModule } from '@/modules/users/users.module';
import { MessagingModule } from '@/common/messaging/messaging.module';
import { ParkingModule } from '@/modules/parking/parking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    MessagingModule,
    UsersModule,
    ParkingModule,
  ],
  controllers: [ReservationController],
  providers: [
    ...useCases,
    {
      provide: 'ReservationRepositoryPort',
      useClass: TypeOrmReservationRepository,
    },
    ReleaseExpiredJob,
  ],
  exports: [],
})
export class ReservationsModule {}
