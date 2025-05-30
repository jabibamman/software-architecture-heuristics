import { GetReservationsUseCase } from '../get-reservations.use-case';
import { ReservationRepositoryPort } from '../../ports/reservation.repository.port';
import { ReservationResponseDto } from '../../dtos/reservation-response.dto';
import { Reservation } from '../../../domain/entities/reservation.entity';

describe('GetReservationsUseCase', () => {
  let useCase: GetReservationsUseCase;
  let repo: jest.Mocked<ReservationRepositoryPort>;

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findReservationsForDate: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
    } as any;
    useCase = new GetReservationsUseCase(repo);
  });

  it('should return an empty list when no reservation', async () => {
    repo.findAll.mockResolvedValue([]);
    const result = await useCase.execute();
    expect(repo.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should return a list of dto', async () => {
    const e1 = Object.assign(new Reservation(), {
      id: 'r1',
      slotId: 'A01',
      startDate: new Date('2025-06-01T09:00:00Z'),
      endDate: new Date('2025-06-01T17:00:00Z'),
      needsCharger: false,
      checkedIn: false,
      checkedInAt: null,
      createdAt: new Date('2025-05-30T08:00:00Z'),
      updatedAt: new Date('2025-05-30T08:00:00Z'),
    });
    const e2 = Object.assign(new Reservation(), {
      id: 'r2',
      slotId: 'F10',
      startDate: new Date('2025-06-02T09:00:00Z'),
      endDate: new Date('2025-06-02T17:00:00Z'),
      needsCharger: true,
      checkedIn: true,
      checkedInAt: new Date('2025-06-02T09:15:00Z'),
      createdAt: new Date('2025-05-30T09:00:00Z'),
      updatedAt: new Date('2025-05-30T09:05:00Z'),
    });
    repo.findAll.mockResolvedValue([e1, e2]);

    const result = await useCase.execute();
    expect(result).toEqual([
      ReservationResponseDto.fromEntity(e1),
      ReservationResponseDto.fromEntity(e2),
    ]);
  });
});
