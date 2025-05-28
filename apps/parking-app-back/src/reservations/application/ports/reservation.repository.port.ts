import { Reservation } from '../../domain/entities/reservation';

export interface ReservationRepositoryPort {
  findAll(): Promise<Reservation[]>;
  save(reservation: Reservation): Promise<Reservation>;
  findById(id: string): Promise<Reservation | null>;
}
