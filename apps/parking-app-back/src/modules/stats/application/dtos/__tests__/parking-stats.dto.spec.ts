import { validateSync } from 'class-validator';
import { ParkingStatsDto } from '../parking-stats.dto';

describe('ParkingStatsDto', () => {
  it('should validate a correct stats DTO', () => {
    const dto = Object.assign(new ParkingStatsDto(), {
      totalSlots: 60,
      reservedToday: 20,
      checkedInToday: 15,
      chargerUsagePct: 30,
    });
    const errors = validateSync(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject negative numbers', () => {
    const dto = Object.assign(new ParkingStatsDto(), {
      totalSlots: -1,
      reservedToday: -5,
      checkedInToday: -2,
      chargerUsagePct: -10,
    });
    const errors = validateSync(dto);
    const props = errors.map((e) => e.property);
    expect(props).toEqual(
      expect.arrayContaining([
        'totalSlots',
        'reservedToday',
        'checkedInToday',
        'chargerUsagePct',
      ]),
    );
    errors.forEach((e) => {
      expect(e.constraints).toHaveProperty('min');
    });
  });

  it('should reject non-numeric values', () => {
    const dto = Object.assign(new ParkingStatsDto(), {
      totalSlots: 'sixty',
      reservedToday: 'twenty',
      checkedInToday: null,
      chargerUsagePct: 'lots',
    });
    const errors = validateSync(dto);
    const props = errors.map((e) => e.property);
    expect(props).toEqual(
      expect.arrayContaining([
        'totalSlots',
        'reservedToday',
        'checkedInToday',
        'chargerUsagePct',
      ]),
    );
    errors.forEach((e) => {
      expect(e.constraints).toHaveProperty('isNumber');
    });
  });

  it('should reject chargerUsagePct > 100', () => {
    const dto = Object.assign(new ParkingStatsDto(), {
      totalSlots: 60,
      reservedToday: 20,
      checkedInToday: 15,
      chargerUsagePct: 150,
    });
    const errors = validateSync(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('chargerUsagePct');
    expect(errors[0].constraints).toHaveProperty('max');
  });
});
