import { Reservation } from '../entities/reservation.entity';

export class ReservationCreatedEvent {
  constructor(public readonly reservation: Reservation) {}
}
