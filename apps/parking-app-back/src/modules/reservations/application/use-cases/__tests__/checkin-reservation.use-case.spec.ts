import { ReservationRepositoryPort } from '../../ports/reservation.repository.port';
import { EventPublisher } from '@/common/messaging/ports/event-publisher.port';
import { GetUserByEmailUseCase } from '@/modules/users/application/use-cases/get-user-by-email.use-case';
import { JwtPayload } from '@/modules/auth/application/dtos/jwt-payload';
import { User } from '@/modules/users/domain/entities/user.entity';
import { CheckInReservationUseCase } from '../checkin-reservation.use-case';
import { Reservation } from '@/modules/reservations/domain/entities/reservation.entity';
import { ReservationCheckedInEvent } from '@/modules/reservations/domain/events/reservation-checked-in.event';
import { ReservationResponseDto } from '../../dtos/reservation-response.dto';
import { ReservationUnauthorizedException } from '@/modules/reservations/domain/exceptions';
import { ReservationBadRequestException } from '@/modules/reservations/domain/exceptions';
import { CheckInReservationDto } from '../../dtos/checkin-reservation.dto';

describe('CheckInReservationUseCase (with JWT)', () => {
  let useCase: CheckInReservationUseCase;
  let repo: jest.Mocked<ReservationRepositoryPort>;
  let publisher: jest.Mocked<EventPublisher>;
  let findUser: jest.Mocked<GetUserByEmailUseCase>;

  let fakeUser: User;
  let payload: JwtPayload;

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findReservationsForDate: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
    } as any;

    publisher = { publish: jest.fn() } as any;
    findUser = { execute: jest.fn() } as any;

    useCase = new CheckInReservationUseCase(repo, publisher, findUser);

    fakeUser = new User();
    fakeUser.id = 'user-123';
    fakeUser.email = 'alice@example.com';

    payload = JwtPayload.from(fakeUser);
    findUser.execute.mockResolvedValue(fakeUser);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should checks in successfully when reservation belongs to the JWT user and policy allows', async () => {
    // freeze time at 10:00
    const now = new Date();
    now.setHours(10, 0, 0, 0);
    jest.useFakeTimers().setSystemTime(now);

    const reservation = Reservation.create(
      fakeUser.id,
      'A01',
      new Date(now),
      new Date(now),
      false,
    );
    reservation.checkedIn = false;
    reservation.checkedInAt = undefined;
    reservation.createdAt = now;
    reservation.updatedAt = now;

    repo.findById.mockResolvedValue(reservation);
    repo.save.mockImplementation(async (r) => r);

    const dto = new CheckInReservationDto();
    dto.id = 'resv-1';

    const result = await useCase.execute(dto, payload);

    expect(findUser.execute).toHaveBeenCalledWith(payload.email, {
      throwIfNotFound: true,
    });

    expect(repo.findById).toHaveBeenCalledWith(dto.id);

    const saved = repo.save.mock.calls[0][0] as Reservation;
    expect(saved.checkedIn).toBe(true);
    expect(saved.checkedInAt).toBeInstanceOf(Date);

    expect(publisher.publish).toHaveBeenCalledWith(
      new ReservationCheckedInEvent(saved),
    );

    expect(result).toEqual(ReservationResponseDto.fromEntity(saved));
  });

  it('should throws if the reservation belongs to someone else', async () => {
    const other = Reservation.create(
      'other-user',
      'A01',
      new Date(),
      new Date(),
      false,
    );
    repo.findById.mockResolvedValue(other);

    const dto = new CheckInReservationDto();
    dto.id = 'resv-2';

    await expect(useCase.execute(dto, payload)).rejects.toThrow(
      ReservationUnauthorizedException,
    );

    expect(findUser.execute).toHaveBeenCalledWith(payload.email, {
      throwIfNotFound: true,
    });
    expect(repo.save).not.toHaveBeenCalled();
    expect(publisher.publish).not.toHaveBeenCalled();
  });

  it('should throws if check-in is not allowed by the policy (too early/late)', async () => {
    // freeze time at 10:00
    const now = new Date();
    now.setHours(10, 0, 0, 0);
    jest.useFakeTimers().setSystemTime(now);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const futureRes = Reservation.create(
      fakeUser.id,
      'A01',
      tomorrow,
      tomorrow,
      false,
    );
    repo.findById.mockResolvedValue(futureRes);

    const dto = new CheckInReservationDto();
    dto.id = 'resv-3';

    await expect(useCase.execute(dto, payload)).rejects.toThrow(
      ReservationBadRequestException,
    );

    expect(findUser.execute).toHaveBeenCalledWith(payload.email, {
      throwIfNotFound: true,
    });
    expect(repo.save).not.toHaveBeenCalled();
    expect(publisher.publish).not.toHaveBeenCalled();
  });
});
