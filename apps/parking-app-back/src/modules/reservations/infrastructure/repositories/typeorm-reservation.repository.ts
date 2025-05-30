import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationRepositoryPort } from '../../application/ports/reservation.repository.port';
import { ReservationNotFoundException } from '@/modules/reservations/domain/exceptions';

@Injectable()
export class TypeOrmReservationRepository implements ReservationRepositoryPort {
  constructor(
    @InjectRepository(Reservation)
    private readonly repo: Repository<Reservation>,
  ) {}

  async save(reservation: Reservation): Promise<Reservation> {
    return this.repo.save(reservation);
  }

  async findById(id: string): Promise<Reservation | null> {
    const r = await this.repo.findOne({ where: { id } });
    if (!r) throw new ReservationNotFoundException(id);

    return r;
  }

  async findAll(): Promise<Reservation[]> {
    return this.repo.find();
  }

  async deleteById(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
