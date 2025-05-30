import { Reservation } from '../entities/reservation.entity';

export class ReservationCheckedInEvent {
  constructor(public readonly reservation: Reservation) {}
}
