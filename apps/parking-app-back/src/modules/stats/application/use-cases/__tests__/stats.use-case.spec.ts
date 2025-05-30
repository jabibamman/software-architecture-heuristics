import { GetParkingStatsUseCase } from '../get-parking-stats.use-case';
import { GetManagerStatsUseCase } from '../get-manager-stats.use-case';
import { ParkingStatsDto } from '../../dtos/parking-stats.dto';
import { ManagerStatsDto } from '../../dtos/manager-stats.dto';

describe('GetParkingStatsUseCase', () => {
  let useCase: GetParkingStatsUseCase;

  beforeAll(() => {
    useCase = new GetParkingStatsUseCase();
  });

  it('should return the expected parking stats object', async () => {
    const result = await useCase.execute();

    expect(result).toBeInstanceOf(Object);
    expect(result).toEqual<ParkingStatsDto>({
      totalSlots: 60,
      reservedToday: 20,
      checkedInToday: 15,
      chargerUsagePct: 30,
    });
  });
});

describe('GetManagerStatsUseCase', () => {
  let useCase: GetManagerStatsUseCase;

  beforeAll(() => {
    useCase = new GetManagerStatsUseCase();
  });

  it('should return the expected manager stats object', async () => {
    const result = await useCase.execute();

    expect(result).toBeInstanceOf(Object);
    expect(result).toEqual<ManagerStatsDto>({
      totalSlots: 60,
      avgOccupancyPct: 72,
      noShowPct: 8,
      chargerSlotsPct: 33,
      reservationsLastWeek: 215,
      reservedToday: 10,
      checkedInToday: 5,
    });
  });
});
