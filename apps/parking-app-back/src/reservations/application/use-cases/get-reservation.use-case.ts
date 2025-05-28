import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReservationResponseDto } from '../dtos/reservation-response.dto';
import { ReservationRepositoryPort } from '../ports/reservation.repository.port';

@Injectable()
export class GetReservationUseCase {
  constructor(
    @Inject('ReservationRepositoryPort')
    private readonly repo: ReservationRepositoryPort,
  ) {}

  async execute(id: string): Promise<ReservationResponseDto> {
    const reservation = await this.repo.findById(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation ${id} not found`);
    }
    return {
      id: reservation.id,
      slotId: reservation.slotId,
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      needsCharger: reservation.needsCharger,
      createdAt: reservation.createdAt.toISOString(),
    };
  }
}
