import { Global, Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConsoleEventPublisher } from './adapters/console-publisher.adapter';
//import { AmqpNotificationAdapter } from './adapters/amqp-publisher.adapter';

@Global()
@Module({
  imports: [
    /*
    RabbitMQModule.forRoot({
      exchanges: [{ name: 'reservations.exchange', type: 'topic' }],
      uri: process.env.AMQP_URI || 'amqp://localhost',
    }),
  */
  ],
  providers: [
    {
      provide: 'EventPublisher',
      useClass: /*AmqpNotificationAdapter*/ ConsoleEventPublisher,
    },
  ],
  exports: ['EventPublisher'],
})
export class MessagingModule {}
