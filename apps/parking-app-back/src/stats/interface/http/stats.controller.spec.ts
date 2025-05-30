import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { GetParkingStatsUseCase } from '../../application/use-cases/get-parking-stats.use-case';
import { ParkingStatsDto } from '../../application/dtos/parking-stats.dto';

describe('StatsController', () => {
  let controller: StatsController;
  let useCase: jest.Mocked<GetParkingStatsUseCase>;

  beforeEach(async () => {
    const useCaseMock: Partial<jest.Mocked<GetParkingStatsUseCase>> = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [{ provide: GetParkingStatsUseCase, useValue: useCaseMock }],
    }).compile();

    controller = module.get<StatsController>(StatsController);
    useCase = module.get(GetParkingStatsUseCase) as any;
  });

  it('should return parking stats from the use-case', async () => {
    const fakeStats: ParkingStatsDto = {
      totalSlots: 60,
      reservedToday: 15,
      checkedInToday: 10,
      chargerUsagePct: 50,
    };

    useCase.execute.mockResolvedValue(fakeStats);

    const result = await controller.getParkingStats();
    expect(useCase.execute).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeStats);
  });

  it('should propagate errors from the use-case', async () => {
    useCase.execute.mockRejectedValue(new Error('boom'));

    await expect(controller.getParkingStats()).rejects.toThrow('boom');
    expect(useCase.execute).toHaveBeenCalled();
  });
});
