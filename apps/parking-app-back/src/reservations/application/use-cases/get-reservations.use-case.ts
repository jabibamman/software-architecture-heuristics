import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReservationResponseDto } from '../dtos/reservation-response.dto';
import { ReservationRepositoryPort } from '../ports/reservation.repository.port';

@Injectable()
export class GetReservationsUseCase {
  constructor(
    @Inject('ReservationRepositoryPort')
    private readonly repo: ReservationRepositoryPort,
  ) {}

  async execute(): Promise<ReservationResponseDto[]> {
    const reservations = await this.repo.findAll();
    if (!reservations) {
      throw new NotFoundException(`Reservations not found`);
    }
    return reservations.map((reservation) => ({
      id: reservation.id,
      slotId: reservation.slotId,
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      needsCharger: reservation.needsCharger,
      createdAt: reservation.createdAt.toISOString(),
    }));
  }
}
