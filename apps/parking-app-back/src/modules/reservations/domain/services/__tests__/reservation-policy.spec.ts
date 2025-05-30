import { Reservation } from '../../entities/reservation.entity';
import { ReservationPolicy } from '../reservation-policy';
import { Role } from '@/modules/users/domain/value-objects/role.value-object';

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
    jest.useFakeTimers({ legacyFakeTimers: false });
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('passes when check-in is on start date before 11 AM', () => {
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

  it('rejects when not on start date', () => {
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

  it('rejects when after 11 AM', () => {
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

describe('ReservationPolicy.findExpired', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('includes only today’s unchecked after 11 AM', () => {
    const now = new Date();
    now.setHours(11, 30, 0, 0);
    jest.useFakeTimers().setSystemTime(now);

    const a = makeReservation();
    const b = makeReservation({ checkedIn: true });
    const c = makeReservation({
      startDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    });
    const d = makeReservation({
      startDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    });

    const expired = ReservationPolicy.findExpired([a, b, c, d]);
    expect(expired).toEqual([a]);
  });

  it('returns empty before 11 AM', () => {
    const now = new Date();
    now.setHours(10, 59, 0, 0);
    jest.useFakeTimers().setSystemTime(now);

    const a = makeReservation();
    expect(ReservationPolicy.findExpired([a])).toHaveLength(0);
  });

  it('ignores other days even after 11 AM', () => {
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    jest.useFakeTimers().setSystemTime(now);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const a = makeReservation({ startDate: tomorrow, endDate: tomorrow });

    expect(ReservationPolicy.findExpired([a])).toHaveLength(0);
  });
});

describe('ReservationPolicy.validateReservation', () => {
  it('accepts valid for EMPLOYEE', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reservation = {
      slotId: 'B02',
      startDate: today,
      endDate: today,
      needsCharger: false,
    } as any;

    expect(() =>
      ReservationPolicy.validateReservation(reservation, Role.EMPLOYEE),
    ).not.toThrow();
  });

  it('rejects past start date', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const r = makeReservation({ startDate: yesterday, endDate: yesterday });
    expect(() =>
      ReservationPolicy.validateReservation(r as any, Role.EMPLOYEE),
    ).toThrow('Reservation start date cannot be in the past.');
  });

  it('rejects startDate > endDate', () => {
    const r = makeReservation({
      startDate: new Date('2025-06-05'),
      endDate: new Date('2025-06-04'),
    });
    expect(() =>
      ReservationPolicy.validateReservation(r as any, Role.EMPLOYEE),
    ).toThrow('Reservation start date must be on or before the end date.');
  });

  it('rejects >5 business days for EMPLOYEE', () => {
    const r = makeReservation({
      startDate: new Date('2025-06-02'),
      endDate: new Date('2025-06-10'),
    });
    expect(() =>
      ReservationPolicy.validateReservation(r as any, Role.EMPLOYEE),
    ).toThrow('Cannot book more than 5 business days.');
  });

  it('allows up to 30 days for MANAGER', () => {
    const r = makeReservation({
      startDate: new Date('2025-06-02'),
      endDate: new Date('2025-07-15'),
    });
    expect(() =>
      ReservationPolicy.validateReservation(r as any, Role.MANAGER),
    ).not.toThrow();
  });

  it('rejects charger outside A/F', () => {
    const r = makeReservation({
      slotId: 'B03',
      needsCharger: true,
    });
    expect(() =>
      ReservationPolicy.validateReservation(r as any, Role.EMPLOYEE),
    ).toThrow('Charger only in rows A or F.');
  });
});
describe('ReservationPolicy.validateReservation for SECRETARY', () => {
  it('should allow any reservation for a secretary', () => {
    const r = new Reservation();
    r.slotId = 'Z99';
    r.startDate = new Date('2000-01-01');
    r.endDate = new Date('1999-12-31');
    r.needsCharger = true;
    r.checkedIn = false;
    r.userId = 'u1';
    r.createdAt = new Date();
    r.updatedAt = new Date();

    expect(() =>
      ReservationPolicy.validateReservation(r, Role.SECRETARY),
    ).not.toThrow();
  });
});
