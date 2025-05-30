import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ReservationCreationDto } from '../reservation-creation.dto';

describe('ReservationCreationDto', () => {
  it('should validate a correct DTO', () => {
    const dto = plainToInstance(ReservationCreationDto, {
      slotId: 'B05',
      startDate: '2025-06-01T09:00:00Z',
      endDate: '2025-06-01T17:00:00Z',
      needsCharger: false,
      notes: 'Near entrance',
    });
    const errors = validateSync(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid slotId', () => {
    const dto = plainToInstance(ReservationCreationDto, {
      slotId: 'Z99',
      startDate: '2025-06-01T09:00:00Z',
      endDate: '2025-06-01T17:00:00Z',
      needsCharger: false,
    });
    const errors = validateSync(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('slotId');
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('should reject non-ISO dates', () => {
    const dto = plainToInstance(ReservationCreationDto, {
      slotId: 'A10',
      startDate: '06/01/2025',
      endDate: '2025-06-01T17:00:00Z',
      needsCharger: true,
    });
    const errors = validateSync(dto);
    const startErr = errors.find((e) => e.property === 'startDate');
    expect(startErr).toBeDefined();
    expect(startErr?.constraints).toHaveProperty('isDateString');
  });

  it('should reject notes that are too long', () => {
    const longNotes = 'x'.repeat(300);
    const dto = plainToInstance(ReservationCreationDto, {
      slotId: 'C03',
      startDate: '2025-06-02T08:00:00Z',
      endDate: '2025-06-02T12:00:00Z',
      needsCharger: false,
      notes: longNotes,
    });
    const errors = validateSync(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('notes');
    // On vérifie isLength, pas length
    expect(errors[0].constraints).toHaveProperty('isLength');
  });
});
