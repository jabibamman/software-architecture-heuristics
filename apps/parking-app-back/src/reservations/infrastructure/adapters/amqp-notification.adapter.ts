import { Injectable } from '@nestjs/common';
import { ReservationCreatedEvent } from '../../domain/events';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { EventPublisher } from '@/common/messaging/ports/event-publisher.port';

@Injectable()
export class AmqpNotificationAdapter implements EventPublisher {
  constructor(private readonly amqp: AmqpConnection) {}

  publish(event: any): void {
    if (event instanceof ReservationCreatedEvent) {
      this.amqp.publish('reservations.exchange', 'reservation.created', {
        id: event.reservation.id,
      });
    }
  }
}
