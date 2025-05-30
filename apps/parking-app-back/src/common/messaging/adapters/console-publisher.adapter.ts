import { Injectable } from '@nestjs/common';
import { EventPublisher } from '../ports/event-publisher.port';

@Injectable()
export class ConsoleEventPublisher implements EventPublisher {
  publish(event: any): void {
    console.log('[Event]', event.constructor.name, event);
  }
}
