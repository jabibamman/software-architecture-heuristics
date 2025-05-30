import { validate } from 'class-validator';
import { ManagerStatsDto } from '../manager-stats.dto';

describe('ManagerStatsDto Validation', () => {
  it('should validate a correct DTO', async () => {
    const dto = Object.assign(new ManagerStatsDto(), {
      totalSlots: 60,
      avgOccupancyPct: 72,
      noShowPct: 8,
      chargerSlotsPct: 33,
      reservationsLastWeek: 215,
      reservedToday: 10,
      checkedInToday: 5,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should error on negative and excessive values', async () => {
    const dto = Object.assign(new ManagerStatsDto(), {
      totalSlots: -1,
      avgOccupancyPct: 120,
      noShowPct: -5,
      chargerSlotsPct: 101,
      reservationsLastWeek: -10,
      reservedToday: -3,
      checkedInToday: -2,
    });

    const errors = await validate(dto);
    const messages = errors.flatMap((e) => Object.values(e.constraints || {}));

    expect(messages).toContain('totalSlots must be at least 0');
    expect(messages).toContain('avgOccupancyPct cannot exceed 100');
    expect(messages).toContain('noShowPct must be at least 0');
    expect(messages).toContain('chargerSlotsPct cannot exceed 100');
    expect(messages).toContain('reservationsLastWeek must be at least 0');
    expect(messages).toContain('checkedInToday must be at least 0');
  });

  it('should error on non-numeric values', async () => {
    const dto: any = Object.assign(new ManagerStatsDto(), {
      totalSlots: 'sixty',
      avgOccupancyPct: 'seventy-two',
      noShowPct: 'eight',
      chargerSlotsPct: 'thirty-three',
      reservationsLastWeek: 'two fifteen',
      reservedToday: 'ten',
      checkedInToday: 'five',
    });

    const errors = await validate(dto);
    const messages = errors.flatMap((e) => Object.values(e.constraints || {}));

    expect(messages).toContain('totalSlots must be a number');
    expect(messages).toContain('avgOccupancyPct must be a number');
    expect(messages).toContain('noShowPct must be a number');
    expect(messages).toContain('chargerSlotsPct must be a number');
    expect(messages).toContain('reservationsLastWeek must be a number');
    expect(messages).toContain('checkedInToday must be a number');
  });

  it('should error when required fields are missing', async () => {
    const dto = new ManagerStatsDto(); // tous les champs sont undefined
    const errors = await validate(dto);
    // On attend au moins des erreurs sur totalSlots, avgOccupancyPct, noShowPct, chargerSlotsPct,
    // reservationsLastWeek et checkedInToday (6 champs validés)
    expect(errors.length).toBeGreaterThanOrEqual(6);
  });
});
