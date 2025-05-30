import { Injectable, Inject } from '@nestjs/common';
import { SlotDto } from '../dtos/slot.dto';
import { ReservationRepositoryPort } from '@/modules/reservations/application/ports/reservation.repository.port';

@Injectable()
export class GetSlotsStatusUseCase {
  constructor(
    @Inject('ReservationRepositoryPort')
    private readonly reservationRepo: ReservationRepositoryPort,
  ) {}

  async execute(date: Date): Promise<SlotDto[]> {
    const allSlots: SlotDto[] = [];
    for (let row = 0; row < 6; row++) {
      const letter = String.fromCharCode(65 + row);
      for (let num = 1; num <= 10; num++) {
        allSlots.push({
          id: `${letter}${String(num).padStart(2, '0')}`,
          reserved: false,
        });
      }
    }

    const reservations =
      await this.reservationRepo.findReservationsForDate(date);

    const reservedIds = new Set(reservations.map((r) => r.slotId));
    return allSlots.map((s) => ({
      id: s.id,
      reserved: reservedIds.has(s.id),
    }));
  }
}
