import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../../domain/entities/reservation';
import { ReservationRepositoryPort } from '../../application/ports/reservation.repository.port';

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
    return this.repo.findOne({ where: { id } });
  }

  async findAll(): Promise<Reservation[]> {
    return this.repo.find();
  }
}
