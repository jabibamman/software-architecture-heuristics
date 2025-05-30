import { Logger, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { StatsModule } from './modules/stats/stats.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthController } from './health.controller';
import { configModule } from './common/config/config.module';
import { typeOrmConfig } from './common/config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagingModule } from './common/messaging/messaging.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    configModule,
    MessagingModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ScheduleModule.forRoot(),
    ReservationsModule,
    UsersModule,
    AuthModule,
    StatsModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
  providers: [Logger, AppService],
})
export class AppModule {}
