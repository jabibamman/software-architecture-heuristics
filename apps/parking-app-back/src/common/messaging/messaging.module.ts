import { Global, Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { EventPublisher } from './ports/event-publisher.port';
import { ConsoleEventPublisher } from './adapters/console-publisher.adapter';

@Global()
@Module({
  imports: [
    /*
    RabbitMQModule.forRoot({
      exchanges: [{ name: 'reservations.exchange', type: 'topic' }],
      uri: process.env.AMQP_URI || 'amqp://localhost',
    }),*/
  ],
  providers: [
    {
      provide: 'EventPublisher',
      useClass: ConsoleEventPublisher,
    },
  ],
  exports: ['EventPublisher'],
})
export class MessagingModule {}
