import { Inject, Injectable } from '@nestjs/common';
import { ReservationRepositoryPort } from '../ports/reservation.repository.port';
import { EventPublisher } from '@/common/messaging/ports/event-publisher.port';
import { ReservationReleasedEvent } from '../../domain/events/reservation-released.event';
import { ReservationPolicy } from '../../domain/services/reservation-policy';

@Injectable()
export class ReleaseExpiredReservationsUseCase {
  constructor(
    @Inject('ReservationRepositoryPort')
    private readonly repo: ReservationRepositoryPort,
    @Inject('EventPublisher')
    private readonly publisher: EventPublisher,
  ) {}

  async execute(): Promise<void> {
    const all = await this.repo.findAll();
    const expired = ReservationPolicy.findExpired(all);

    for (const r of expired) {
      await this.repo.deleteById(r.id);
      this.publisher.publish(new ReservationReleasedEvent(r));
    }
  }
}
