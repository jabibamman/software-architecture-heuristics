import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ReservationsModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StatsModule } from './stats/stats.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ReservationsModule,
    UsersModule,
    AuthModule,
    StatsModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
  providers: [AppService],
})
export class AppModule {}
