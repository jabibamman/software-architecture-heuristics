import { validateSync } from 'class-validator';
import { SlotDto } from '../slot.dto';

describe('SlotDto', () => {
  it('should accept a minimal valid DTO (unreserved slot)', () => {
    const dto = Object.assign(new SlotDto(), {
      id: 'B10',
      reserved: false,
    });

    const errors = validateSync(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid slot id', () => {
    const dto = Object.assign(new SlotDto(), {
      id: 'Z99',
      reserved: false,
    });

    const errors = validateSync(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('id');
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('should reject missing reserved flag', () => {
    const dto = Object.assign(new SlotDto(), {
      id: 'C05',
    } as any);

    const errors = validateSync(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('reserved');
    expect(errors[0].constraints).toHaveProperty('isBoolean');
  });

  it('should reject invalid ISO dates', () => {
    const dto = Object.assign(new SlotDto(), {
      id: 'D02',
      reserved: true,
      reservationStart: 'not-a-date',
      reservationEnd: 'also-not-a-date',
    });

    const errors = validateSync(dto);
    expect(errors).toHaveLength(2);
    const props = errors.map((e) => e.property).sort();
    expect(props).toEqual(['reservationEnd', 'reservationStart']);
  });

  it('should reject invalid UUID for reservedBy', () => {
    const dto = Object.assign(new SlotDto(), {
      id: 'E07',
      reserved: true,
      reservedBy: 'not-a-uuid',
    });

    const errors = validateSync(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('reservedBy');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });
});
