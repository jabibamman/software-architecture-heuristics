import { Reservation } from '../entities/reservation.entity';

export class ReservationReleasedEvent {
  constructor(public readonly reservation: Reservation) {}
}
