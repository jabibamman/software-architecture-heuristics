import { Module } from '@nestjs/common';
import { SendNotificationUseCase } from './application/use-cases/send-notification.use-case';

@Module({
  imports: [],
  controllers: [],
  providers: [SendNotificationUseCase],
  exports: [],
})
export class NotificationsModule {}
