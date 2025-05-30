import { ReleaseExpiredReservationsUseCase } from '../release-expired.use-case';
import { ReservationRepositoryPort } from '../../ports/reservation.repository.port';
import { EventPublisher } from '@/common/messaging/ports/event-publisher.port';
import { ReservationReleasedEvent } from '../../../domain/events';
import { Reservation } from '../../../domain/entities/reservation.entity';

describe('ReleaseExpiredReservationsUseCase', () => {
  let useCase: ReleaseExpiredReservationsUseCase;
  let repo: jest.Mocked<ReservationRepositoryPort>;
  let publisher: jest.Mocked<EventPublisher>;

  function makeReservation(overrides: Partial<Reservation> = {}): Reservation {
    const r = new Reservation();
    r.id = overrides.id ?? 'res-' + Math.random().toString(36).substr(2, 5);
    r.slotId = overrides.slotId ?? 'B02';
    r.startDate = overrides.startDate ?? new Date();
    r.endDate = overrides.endDate ?? r.startDate;
    r.needsCharger = overrides.needsCharger ?? false;
    r.checkedIn = overrides.checkedIn ?? false;
    r.checkedInAt = overrides.checkedInAt ?? undefined;
    r.notes = overrides.notes;
    r.createdAt = overrides.createdAt ?? new Date();
    r.updatedAt = overrides.updatedAt ?? new Date();
    r.userId = overrides.userId ?? 'user-1';
    return r;
  }

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      deleteById: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
    } as any;

    publisher = {
      publish: jest.fn(),
    } as any;

    useCase = new ReleaseExpiredReservationsUseCase(repo, publisher);

    const now = new Date();
    now.setHours(12, 0, 0, 0);
    jest.useFakeTimers().setSystemTime(now);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('ne supprime et ne publie rien si aucune réservation n’est expirée', async () => {
    const todayCheckedIn = makeReservation({ checkedIn: true });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const future = makeReservation({ startDate: tomorrow, endDate: tomorrow });
    repo.findAll.mockResolvedValue([todayCheckedIn, future]);

    await useCase.execute();

    expect(repo.deleteById).not.toHaveBeenCalled();
    expect(publisher.publish).not.toHaveBeenCalled();
  });

  it('supprime et publie un seul événement pour chaque résa expirée', async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const a = makeReservation({
      id: 'r1',
      startDate: today,
      endDate: today,
      checkedIn: false,
    });
    const b = makeReservation({
      id: 'r2',
      startDate: today,
      endDate: today,
      checkedIn: true,
    });
    const c = makeReservation({
      id: 'r3',
      startDate: new Date(today.getTime() + 24 * 3600 * 1000),
      endDate: today,
      checkedIn: false,
    });

    repo.findAll.mockResolvedValue([a, b, c]);

    await useCase.execute();

    expect(repo.deleteById).toHaveBeenCalledTimes(1);
    expect(repo.deleteById).toHaveBeenCalledWith('r1');

    expect(publisher.publish).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledWith(
      new ReservationReleasedEvent(a),
    );
  });

  it('gère plusieurs résas expirées', async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const a = makeReservation({
      id: 'r1',
      startDate: today,
      endDate: today,
      checkedIn: false,
    });
    const d = makeReservation({
      id: 'r4',
      startDate: today,
      endDate: today,
      checkedIn: false,
    });

    repo.findAll.mockResolvedValue([a, d]);

    await useCase.execute();

    expect(repo.deleteById).toHaveBeenCalledTimes(2);
    expect(repo.deleteById).toHaveBeenNthCalledWith(1, 'r1');
    expect(repo.deleteById).toHaveBeenNthCalledWith(2, 'r4');

    expect(publisher.publish).toHaveBeenCalledTimes(2);
    expect(publisher.publish).toHaveBeenNthCalledWith(
      1,
      new ReservationReleasedEvent(a),
    );
    expect(publisher.publish).toHaveBeenNthCalledWith(
      2,
      new ReservationReleasedEvent(d),
    );
  });
});
