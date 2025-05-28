import { Logger, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ReservationsModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StatsModule } from './stats/stats.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthController } from './health.controller';
import { configModule } from './config/config.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRoot(typeOrmConfig),
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
