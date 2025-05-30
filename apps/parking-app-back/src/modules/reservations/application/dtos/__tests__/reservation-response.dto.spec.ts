import { validateSync } from 'class-validator';
import { ReservationResponseDto } from '../reservation-response.dto';

describe('ReservationResponseDto', () => {
  const base = {
    id: '11111111-2222-3333-4444-555555555555',
    slotId: 'D07',
    startDate: new Date('2025-06-03T10:00:00Z'),
    endDate: new Date('2025-06-03T12:00:00Z'),
    needsCharger: true,
    checkedIn: true,
    checkedInAt: new Date('2025-06-03T10:15:00Z'),
    createdAt: new Date('2025-06-01T09:00:00Z'),
    updatedAt: new Date('2025-06-01T09:05:00Z'),
  };

  it('should map entity-like object to DTO correctly', () => {
    const plain = ReservationResponseDto.fromEntity(base as any);
    expect(plain).toEqual({
      id: base.id,
      slotId: base.slotId,
      startDate: base.startDate.toISOString(),
      endDate: base.endDate.toISOString(),
      needsCharger: base.needsCharger,
      checkedIn: base.checkedIn,
      checkedInAt: base.checkedInAt.toISOString(),
      createdAt: base.createdAt.toISOString(),
      updatedAt: base.updatedAt.toISOString(),
    });
  });

  it('should validate a correct response DTO', () => {
    // On lève une vraie instance pour la validation
    const dto = Object.assign(
      new ReservationResponseDto(),
      ReservationResponseDto.fromEntity(base as any),
    );
    const errors = validateSync(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid boolean on checkedIn', () => {
    const dto = Object.assign(
      new ReservationResponseDto(),
      ReservationResponseDto.fromEntity(base as any),
      {
        // @ts-ignore
        checkedIn: 'yes',
      },
    );
    const errors = validateSync(dto);
    const err = errors.find((e) => e.property === 'checkedIn');
    expect(err).toBeDefined();
    expect(err?.constraints).toHaveProperty('isBoolean');
  });
});
