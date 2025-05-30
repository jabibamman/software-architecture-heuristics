import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { EventPublisher } from '../ports/event-publisher.port';
import {
  ReservationCheckedInEvent,
  ReservationCreatedEvent,
  ReservationReleasedEvent,
} from '@/reservations/domain/events';

@Injectable()
export class AmqpNotificationAdapter implements EventPublisher {
  constructor(private readonly amqp: AmqpConnection) {}

  publish(event: any): void {
    if (event instanceof ReservationCreatedEvent) {
      this.amqp.publish('reservations.exchange', 'reservation.created', {
        id: event.reservation.id,
      });
    } else if (event instanceof ReservationReleasedEvent) {
      this.amqp.publish('reservations.exchange', 'reservation.released', {
        id: event.reservation.id,
      });
    } else if (event instanceof ReservationCheckedInEvent) {
      this.amqp.publish('reservations.exchange', 'reservation.checkedin', {
        id: event.reservation.id,
      });
    }
  }
}
