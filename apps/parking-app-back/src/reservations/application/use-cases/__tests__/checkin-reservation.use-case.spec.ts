import { CheckInReservationUseCase } from '../checkin-reservation.use-case';
import { ReservationRepositoryPort } from '../../ports/reservation.repository.port';
import { EventPublisher } from '@/common/messaging/ports/event-publisher.port';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { CheckInReservationDto, ReservationResponseDto } from '../../dtos';
import { ReservationCheckedInEvent } from '../../../domain/events';
import { User } from '@/users/domain/entities/user.entity';
import {
  ReservationBadRequestException,
  ReservationUnauthorizedException,
} from '@/reservations/domain/exceptions';
describe('CheckInReservationUseCase', () => {
  let useCase: CheckInReservationUseCase;
  let repo: jest.Mocked<ReservationRepositoryPort>;
  let publisher: jest.Mocked<EventPublisher>;
  let dummyUser: User;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<ReservationRepositoryPort>;

    publisher = {
      publish: jest.fn(),
    } as jest.Mocked<EventPublisher>;

    useCase = new CheckInReservationUseCase(repo, publisher);

    dummyUser = new User();
    dummyUser.id = 'user-123';
  });
  it('✓ should check in successfully when reservation belongs to user and allowed', async () => {
    const now = new Date();
    now.setHours(10, 0, 0, 0);
    jest.useFakeTimers().setSystemTime(now);

    const reservation = Reservation.create(
      'user-123',
      'A01',
      new Date(),
      new Date(),
      false,
      undefined,
    );

    reservation.checkedIn = false;
    reservation.checkedInAt = undefined;

    reservation.createdAt = new Date();
    reservation.updatedAt = new Date();

    repo.findById.mockResolvedValue(reservation);

    repo.save.mockImplementation(async (r) => r);

    const dto = new CheckInReservationDto();
    dto.id = 'whatever-id';

    const result = await useCase.execute(dto, dummyUser);

    expect(repo.findById).toHaveBeenCalledWith(dto.id);

    expect(repo.save).toHaveBeenCalled();
    const savedArg = repo.save.mock.calls[0][0] as Reservation;
    expect(savedArg.checkedIn).toBe(true);
    expect(savedArg.checkedInAt).toBeInstanceOf(Date);

    expect(publisher.publish).toHaveBeenCalledWith(
      new ReservationCheckedInEvent(savedArg),
    );

    expect(result).toEqual(ReservationResponseDto.fromEntity(savedArg));

    jest.useRealTimers();
  });

  it('✗ should throw if reservation does not belong to current user', async () => {
    const reservation = Reservation.create(
      'other-user',
      'A01',
      new Date(),
      new Date(),
      false,
    );
    repo.findById.mockResolvedValue(reservation);

    const dto = new CheckInReservationDto();
    dto.id = 'id-2';

    await expect(useCase.execute(dto, dummyUser)).rejects.toThrow(
      ReservationUnauthorizedException,
    );
    expect(repo.save).not.toHaveBeenCalled();
    expect(publisher.publish).not.toHaveBeenCalled();
  });

  it('✗ should throw if check-in not allowed by policy', async () => {
    const now = new Date();
    now.setHours(10, 0, 0, 0);
    jest.useFakeTimers().setSystemTime(now);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const reservation = Reservation.create(
      'user-123',
      'A01',
      tomorrow,
      tomorrow,
      false,
    );
    repo.findById.mockResolvedValue(reservation);

    const dto = new CheckInReservationDto();
    dto.id = 'id-3';

    await expect(useCase.execute(dto, dummyUser)).rejects.toThrow(
      ReservationBadRequestException,
    );
    expect(repo.save).not.toHaveBeenCalled();
    expect(publisher.publish).not.toHaveBeenCalled();

    jest.useRealTimers();
  });
});
