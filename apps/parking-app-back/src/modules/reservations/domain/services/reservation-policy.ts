import { Reservation } from '../entities/reservation.entity';
import { Role } from '@/modules/users/domain/value-objects/role.value-object';

export class ReservationPolicy {
  static validateReservation(reservation: Reservation, role: Role): void {
    if (role === Role.SECRETARY) {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(reservation.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(reservation.endDate);
    endDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      throw new Error('Reservation start date cannot be in the past.');
    }

    if (startDate.getTime() > endDate.getTime()) {
      throw new Error(
        'Reservation start date must be on or before the end date.',
      );
    }

    if (role === Role.EMPLOYEE) {
      const days = this.countBusinessDays(startDate, endDate);
      if (days > 5) {
        throw new Error(`Cannot book more than 5 business days.`);
      }
    }

    if (reservation.needsCharger) {
      const row = reservation.slotId.charAt(0).toUpperCase();
      if (row !== 'A' && row !== 'F') {
        throw new Error('Charger only in rows A or F.');
      }
    }
  }

  private static countBusinessDays(start: Date, end: Date): number {
    let count = 0;
    const date = new Date(start);
    while (date <= end) {
      const day = date.getDay(); // 0=Sun,6=Sat
      if (day !== 0 && day !== 6) {
        count++;
      }
      date.setDate(date.getDate() + 1);
    }
    return count;
  }

  static assertCheckinAllowed(reservation: Reservation): void {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const startDay = new Date(reservation.startDate);
    startDay.setHours(0, 0, 0, 0);

    if (startDay.getTime() !== today.getTime()) {
      throw new Error('Check-in must happen on the reservation start date.');
    }
    if (now.getHours() >= 11) {
      throw new Error('Check-in must occur before 11 AM.');
    }
  }

  public static findExpired(reservations: Reservation[]): Reservation[] {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    return reservations.filter((r) => {
      const startDay = new Date(r.startDate);
      startDay.setHours(0, 0, 0, 0);
      return (
        startDay.getTime() === today.getTime() &&
        !r.checkedIn &&
        now.getHours() >= 11
      );
    });
  }
}
