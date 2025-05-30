import { GetSlotsStatusUseCase } from '../get-slots-status.use-case';
import { ReservationRepositoryPort } from '@/modules/reservations/application/ports/reservation.repository.port';
import { SlotDto } from '../../dtos/slot.dto';

import { Reservation } from '@/modules/reservations/domain/entities/reservation.entity';
describe('GetSlotsStatusUseCase', () => {
  let useCase: GetSlotsStatusUseCase;
  let repo: jest.Mocked<ReservationRepositoryPort>;

  beforeEach(() => {
    repo = {
      findReservationsForDate: jest.fn(),
    } as any;

    useCase = new GetSlotsStatusUseCase(repo);
  });

  it('should return 60 slots all unreserved when no reservations', async () => {
    const targetDate = new Date('2025-06-15');
    repo.findReservationsForDate.mockResolvedValue([]);

    const slots = await useCase.execute(targetDate);
    expect(slots).toHaveLength(60);
    expect(slots.every((s) => s.reserved === false)).toBe(true);

    expect(slots.find((s) => s.id === 'A01')?.reserved).toBe(false);
    expect(slots.find((s) => s.id === 'F10')?.reserved).toBe(false);
    expect(repo.findReservationsForDate).toHaveBeenCalledWith(targetDate);
  });

  it('should mark as reserved only the slots present in reservations', async () => {
    const targetDate = new Date('2025-06-15');
    const reservations = [
      { slotId: 'A01' },
      { slotId: 'C05' },
      { slotId: 'C05' },
    ] as Reservation[];
    repo.findReservationsForDate.mockResolvedValue(reservations);

    const slots = await useCase.execute(targetDate);
    expect(slots).toHaveLength(60);
    expect(slots.find((s) => s.id === 'A01')?.reserved).toBe(true);
    expect(slots.find((s) => s.id === 'C05')?.reserved).toBe(true);

    expect(slots.find((s) => s.id === 'B10')?.reserved).toBe(false);
  });

  it('should handle reservations on different dates independently', async () => {
    const date1 = new Date('2025-06-15');
    const date2 = new Date('2025-06-16');

    repo.findReservationsForDate.mockImplementation(async (d: Date) => {
      if (d.getTime() === date1.getTime()) {
        return [{ slotId: 'B02' }] as any;
      }
      return [] as any;
    });

    const slots1 = await useCase.execute(date1);
    expect(slots1.find((s) => s.id === 'B02')?.reserved).toBe(true);

    const slots2 = await useCase.execute(date2);
    expect(slots2.every((s) => s.reserved === false)).toBe(true);
  });

  it('should preserve order of slots (A01…F10)', async () => {
    repo.findReservationsForDate.mockResolvedValue([]);

    const slots = await useCase.execute(new Date());

    expect(slots.slice(0, 10).map((s) => s.id)).toEqual([
      'A01',
      'A02',
      'A03',
      'A04',
      'A05',
      'A06',
      'A07',
      'A08',
      'A09',
      'A10',
    ]);

    expect(slots.slice(-10).map((s) => s.id)).toEqual([
      'F01',
      'F02',
      'F03',
      'F04',
      'F05',
      'F06',
      'F07',
      'F08',
      'F09',
      'F10',
    ]);
  });
});
