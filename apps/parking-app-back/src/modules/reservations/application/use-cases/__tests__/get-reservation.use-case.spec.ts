import { GetReservationUseCase } from '../get-reservation.use-case';
import { ReservationRepositoryPort } from '../../ports/reservation.repository.port';
import { ReservationResponseDto } from '../../dtos';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { ReservationNotFoundException } from '../../../domain/exceptions';

describe('GetReservationUseCase', () => {
  let useCase: GetReservationUseCase;
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
    useCase = new GetReservationUseCase(repo);
  });

  it('should return a dto when reservation exists', async () => {
    const entity = Object.assign(new Reservation(), {
      id: 'r-1',
      slotId: 'A01',
      startDate: new Date('2025-06-01T09:00:00Z'),
      endDate: new Date('2025-06-01T17:00:00Z'),
      needsCharger: false,
      checkedIn: false,
      checkedInAt: null,
      createdAt: new Date('2025-05-30T08:00:00Z'),
      updatedAt: new Date('2025-05-30T08:00:00Z'),
    });
    repo.findById.mockResolvedValue(entity);

    const dto = await useCase.execute('r-1');
    expect(repo.findById).toHaveBeenCalledWith('r-1');
    expect(dto).toEqual(ReservationResponseDto.fromEntity(entity));
  });

  it('should throw ReservationNotFoundException when reservation is not found', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(useCase.execute('nope')).rejects.toThrowError(
      ReservationNotFoundException,
    );
  });
});
