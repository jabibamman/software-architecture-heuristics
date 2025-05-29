import { Reservation } from '../entities/reservation.entity';

export class ReservationPolicy {
  static validateReservation(reservation: Reservation): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(reservation.startDate);
    startDate.setHours(0, 0, 0, 0);
    if (startDate < today) {
      throw new Error('Reservation start date cannot be in the past.');
    }

    if (reservation.startDate > reservation.endDate) {
      throw new Error(
        'Reservation start date must be on or before the end date.',
      );
    }

    const businessDays = ReservationPolicy.countBusinessDays(
      reservation.startDate,
      reservation.endDate,
    );
    let maxDaysAllowed = 5;
    // TODO: (role not implemented yet) : if (userRole === 'manager') maxDaysAllowed = 30;
    if (businessDays > maxDaysAllowed) {
      throw new Error(
        `Reservation cannot span more than ${maxDaysAllowed} business days.`,
      );
    }

    if (reservation.needsCharger) {
      const rowLetter = reservation.slotId.charAt(0).toUpperCase();
      if (rowLetter !== 'A' && rowLetter !== 'F') {
        throw new Error(
          'Parking slot must be in row A or F when a charger is needed.',
        );
      }
    }
  }

  private static countBusinessDays(start: Date, end: Date): number {
    let count = 0;
    const date = new Date(start);
    date.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);
    while (date <= endDate) {
      const day = date.getDay(); // 0=Dimanche, 6=Samedi, 1-5 = Lundi-Vendredi
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

      const hour = now.getHours();

      return (
        startDay.getTime() === today.getTime() && !r.checkedIn && hour >= 11
      );
    });
  }
}
