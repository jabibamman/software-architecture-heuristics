import { validateSync } from 'class-validator';
import { CheckInReservationDto } from '../checkin-reservation.dto';

describe('CheckInReservationDto', () => {
  it('should accept a valid UUIDv4', () => {
    const dto = new CheckInReservationDto();
    dto.id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    const errors = validateSync(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject an invalid UUID format', () => {
    const dto = new CheckInReservationDto();
    dto.id = 'not-a-uuid';

    const errors = validateSync(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('id');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should reject a missing id', () => {
    const dto = new CheckInReservationDto();

    const errors = validateSync(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('id');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });
});
