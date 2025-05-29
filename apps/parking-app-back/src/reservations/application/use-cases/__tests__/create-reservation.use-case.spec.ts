import { User } from '@/users/domain/entities/user.entity';
import { CreateReservationUseCase } from '../create-reservation.use-case';
import { ReservationRepositoryPort } from '../../ports/reservation.repository.port';
import { EventPublisher } from '@/common/messaging/ports/event-publisher.port';
import { ReservationCreationDto, ReservationResponseDto } from '../../dtos';
import { ReservationPolicy } from '../../../domain/services/reservation-policy';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { ReservationCreatedEvent } from '../../../domain/events/reservation-created.event';
import { SlotId } from '../../../domain/value-objects';
import { ReservationBadRequestException } from '../../../domain/exceptions';

describe('CreateReservationUseCase', () => {
  let useCase: CreateReservationUseCase;
  let repo: jest.Mocked<ReservationRepositoryPort>;
  let publisher: jest.Mocked<EventPublisher>;
  let dummyUser: User;

  beforeEach(() => {
    repo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as any;

    publisher = {
      publish: jest.fn(),
    } as any;

    useCase = new CreateReservationUseCase(repo, publisher);

    dummyUser = new User();
    dummyUser.id = 'user-123';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a reservation successfully', async () => {
    const dto = Object.assign(new ReservationCreationDto(), {
      slotId: 'A01',
      startDate: '2025-06-01T09:00:00Z',
      endDate: '2025-06-01T17:00:00Z',
      needsCharger: false,
      notes: 'Test note',
    });

    // Let SlotId.create use its real implementation:
    const createSpy = jest.spyOn(SlotId, 'create');

    // Stub out business‐rule validation:
    jest
      .spyOn(ReservationPolicy, 'validateReservation')
      .mockImplementation(() => {});

    // Prepare a fake entity from repository.save
    const entity = Reservation.create(
      dummyUser.id,
      dto.slotId,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.needsCharger,
      dto.notes,
    );
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    entity.checkedIn = false;
    repo.save.mockResolvedValue(entity);

    const result = await useCase.execute(dto, dummyUser);

    expect(createSpy).toHaveBeenCalledWith(dto.slotId);
    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: dummyUser.id,
        slotId: dto.slotId,
        notes: dto.notes,
      }),
    );
    expect(publisher.publish).toHaveBeenCalledWith(
      new ReservationCreatedEvent(entity),
    );
    expect(result).toEqual(ReservationResponseDto.fromEntity(entity));
  });

  it('rejects when slotId is invalid', async () => {
    const dto = Object.assign(new ReservationCreationDto(), {
      slotId: 'Z99',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      needsCharger: false,
    });

    jest.spyOn(SlotId, 'create').mockImplementation(() => {
      throw new Error('invalid slot');
    });

    await expect(useCase.execute(dto, dummyUser)).rejects.toThrow(
      new ReservationBadRequestException('invalid slot'),
    );
    expect(repo.save).not.toHaveBeenCalled();
    expect(publisher.publish).not.toHaveBeenCalled();
  });

  it('rejects when business‐rule validation fails', async () => {
    const dto = Object.assign(new ReservationCreationDto(), {
      slotId: 'A01',
      startDate: '2025-06-01T09:00:00Z',
      endDate: '2025-06-10T09:00:00Z',
      needsCharger: false,
    });

    jest.spyOn(SlotId, 'create');

    jest
      .spyOn(ReservationPolicy, 'validateReservation')
      .mockImplementation(() => {
        throw new Error('too many days');
      });

    await expect(useCase.execute(dto, dummyUser)).rejects.toThrow(
      new ReservationBadRequestException('too many days'),
    );
    expect(repo.save).not.toHaveBeenCalled();
    expect(publisher.publish).not.toHaveBeenCalled();
  });
});
