import { Inject, Injectable } from '@nestjs/common';
import { Reservation } from '../../domain/entities/reservation';
import { ReservationCreationDto } from '../dtos/reservation-creation.dto';
import { ReservationResponseDto } from '../dtos/reservation-response.dto';
import { ReservationRepositoryPort } from '../ports/reservation.repository.port';

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject('ReservationRepositoryPort')
    private readonly repo: ReservationRepositoryPort,
  ) {}

  async execute(dto: ReservationCreationDto): Promise<ReservationResponseDto> {
    const reservation = new Reservation();
    reservation.slotId = dto.slotId;
    reservation.startDate = new Date(dto.startDate);
    reservation.endDate = new Date(dto.endDate);
    reservation.needsCharger = dto.needsCharger;

    const saved = await this.repo.save(reservation);

    return {
      id: saved.id,
      slotId: saved.slotId,
      startDate: saved.startDate.toISOString(),
      endDate: saved.endDate.toISOString(),
      needsCharger: saved.needsCharger,
      createdAt: saved.createdAt.toISOString(),
    };
  }
}
