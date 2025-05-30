import { Reservation } from '../../domain/entities/reservation.entity';

export interface ReservationRepositoryPort {
  deleteById(id: string): Promise<void>;
  findAll(): Promise<Reservation[]>;
  save(reservation: Reservation): Promise<Reservation>;
  findById(id: string): Promise<Reservation | null>;
  findByUserId(userId: string): Promise<Reservation[]>;
  findReservationsForDate(date: Date): Promise<Reservation[]>;
}
