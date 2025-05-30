import { ReservationRepositoryPort } from '../../ports/reservation.repository.port';
import { ReservationResponseDto } from '../../dtos/reservation-response.dto';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { GetReservationsByUserUseCase } from '@/modules/reservations/application/use-cases';
import { User } from '@/modules/users/domain/entities/user.entity';
import { JwtPayload } from '@/modules/auth/application/dtos';

describe('GetReservationsByUserUseCase', () => {
  let useCase: GetReservationsByUserUseCase;
  let repo: jest.Mocked<ReservationRepositoryPort>;
  let dummyUser: User;

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findReservationsForDate: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
    } as any;
    useCase = new GetReservationsByUserUseCase(repo);
    dummyUser = new User();
    dummyUser.id = 'user-123';
    dummyUser.email = 'john@example.com';
  });

  it('should return an empty list when no reservation', async () => {
    const payload = JwtPayload.from(dummyUser);
    repo.findByUserId.mockResolvedValue([]);
    const result = await useCase.execute(payload);
    expect(repo.findByUserId).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should return a list of dto', async () => {
    const payload = JwtPayload.from(dummyUser);
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
      userId: dummyUser.id,
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
      userId: dummyUser.id + 'not-matching', // This should not be returned
    });
    repo.findByUserId.mockResolvedValue([e1]);

    const result = await useCase.execute(payload);
    expect(result).toEqual([ReservationResponseDto.fromEntity(e1)]);
  });
});
