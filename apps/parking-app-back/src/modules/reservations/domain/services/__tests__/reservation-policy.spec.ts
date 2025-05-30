import { Reservation } from '../../entities/reservation.entity';
import { ReservationPolicy } from '../reservation-policy';

type ReservationLike = {
  slotId: string;
  startDate: Date;
  endDate: Date;
  needsCharger: boolean;
  checkedIn: boolean;
};

function makeReservation(overrides: Partial<Reservation> = {}): Reservation {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const r = new Reservation();
  r.id = '00000000-0000-0000-0000-000000000000';
  r.slotId = 'B02';
  r.startDate = new Date(today);
  r.endDate = new Date(today);
  r.needsCharger = false;
  r.checkedIn = false;
  r.checkedInAt = undefined;
  r.notes = undefined;
  r.createdAt = new Date();
  r.updatedAt = new Date();
  r.userId = 'user-1';

  return Object.assign(r, overrides);
}

describe('ReservationPolicy.assertCheckinAllowed', () => {
  beforeAll(() => {
    // Active les modern fake timers pour setSystemTime()
    jest.useFakeTimers({ legacyFakeTimers: false });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should pass when check-in is on the start date before 11 AM', () => {
    const now = new Date();
    now.setHours(10, 0, 0, 0);
    jest.setSystemTime(now);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reservation: ReservationLike = {
      slotId: 'A01',
      startDate: today,
      endDate: today,
      needsCharger: false,
      checkedIn: false,
    };

    expect(() =>
      ReservationPolicy.assertCheckinAllowed(reservation as any),
    ).not.toThrow();
  });

  it('should reject when check-in is not on the start date', () => {
    const now = new Date();
    now.setHours(9, 0, 0, 0);
    jest.setSystemTime(now);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const reservation: ReservationLike = {
      slotId: 'A01',
      startDate: tomorrow,
      endDate: tomorrow,
      needsCharger: false,
      checkedIn: false,
    };

    expect(() =>
      ReservationPolicy.assertCheckinAllowed(reservation as any),
    ).toThrow('Check-in must happen on the reservation start date.');
  });

  it('should reject when check-in is on the start date but after 11 AM', () => {
    const now = new Date();
    now.setHours(11, 30, 0, 0);
    jest.setSystemTime(now);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reservation: ReservationLike = {
      slotId: 'A01',
      startDate: today,
      endDate: today,
      needsCharger: false,
      checkedIn: false,
    };

    expect(() =>
      ReservationPolicy.assertCheckinAllowed(reservation as any),
    ).toThrow('Check-in must occur before 11 AM.');
  });
});

describe('ReservationPolicy.validateReservation', () => {
  it('should accept a valid reservation', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reservation = {
      slotId: 'B02',
      startDate: today,
      endDate: today,
      needsCharger: false,
    } as any;

    expect(() =>
      ReservationPolicy.validateReservation(reservation),
    ).not.toThrow();
  });
});

describe('ReservationPolicy.findExpired', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should include only reservations starting today, unchecked, after 11 AM', () => {
    const now = new Date();
    now.setHours(11, 30, 0, 0);
    jest.useFakeTimers().setSystemTime(now);

    const a = makeReservation();
    const b = makeReservation({ checkedIn: true });
    const c = makeReservation({
      startDate: new Date(now.getTime() + 24 * 60 * 60 * 1000), // demain
    });
    const d = makeReservation({
      startDate: new Date(now.getTime() - 24 * 60 * 60 * 1000), // hier
    });

    const expired = ReservationPolicy.findExpired([a, b, c, d]);
    expect(expired).toEqual([a]);
  });

  it('should return empty array if before 11 AM', () => {
    const now = new Date();
    now.setHours(10, 59, 0, 0);
    jest.useFakeTimers().setSystemTime(now);

    const a = makeReservation();
    const expired = ReservationPolicy.findExpired([a]);
    expect(expired).toHaveLength(0);
  });

  it('should ignore reservations on a different day even after 11 AM', () => {
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    jest.useFakeTimers().setSystemTime(now);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const a = makeReservation({ startDate: tomorrow, endDate: tomorrow });

    const expired = ReservationPolicy.findExpired([a]);
    expect(expired).toHaveLength(0);
  });
});

describe('ReservationPolicy.validateReservation', () => {
  it('should accept a valid reservation', () => {
    const r = makeReservation();
    expect(() => ReservationPolicy.validateReservation(r as any)).not.toThrow();
  });

  it('should reject a start date in the past', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const r = makeReservation({ startDate: yesterday, endDate: yesterday });
    expect(() => ReservationPolicy.validateReservation(r as any)).toThrow(
      'Reservation start date cannot be in the past.',
    );
  });

  it('should reject when startDate > endDate', () => {
    const r = makeReservation({
      startDate: new Date('2025-06-05'),
      endDate: new Date('2025-06-04'),
    });
    expect(() => ReservationPolicy.validateReservation(r as any)).toThrow(
      'Reservation start date must be on or before the end date.',
    );
  });

  it('should reject duration > 5 business days for non-managers', () => {
    const r = makeReservation({
      startDate: new Date('2025-06-02'),
      endDate: new Date('2025-06-10'),
    });
    expect(() => ReservationPolicy.validateReservation(r as any)).toThrow(
      'Reservation cannot span more than 5 business days.',
    );
  });

  it('should reject charger request outside rows A/F', () => {
    const r = makeReservation({
      slotId: 'B03',
      needsCharger: true,
    });
    expect(() => ReservationPolicy.validateReservation(r as any)).toThrow(
      'Parking slot must be in row A or F when a charger is needed.',
    );
  });

  // TODO: ajouter un test pour la condition "manager" (maxDaysAllowed = 30)
});
