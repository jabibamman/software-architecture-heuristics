import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { GetParkingStatsUseCase } from '../../application/use-cases/get-parking-stats.use-case';
import { GetManagerStatsUseCase } from '../../application/use-cases/get-manager-stats.use-case';
import { ParkingStatsDto } from '../../application/dtos/parking-stats.dto';
import { ManagerStatsDto } from '../../application/dtos/manager-stats.dto';

describe('StatsController', () => {
  let controller: StatsController;
  let parkingUseCase: jest.Mocked<GetParkingStatsUseCase>;
  let managerUseCase: jest.Mocked<GetManagerStatsUseCase>;

  beforeEach(async () => {
    const parkingMock: Partial<jest.Mocked<GetParkingStatsUseCase>> = {
      execute: jest.fn(),
    };
    const managerMock: Partial<jest.Mocked<GetManagerStatsUseCase>> = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        { provide: GetParkingStatsUseCase, useValue: parkingMock },
        { provide: GetManagerStatsUseCase, useValue: managerMock },
      ],
    }).compile();

    controller = module.get(StatsController);
    parkingUseCase = module.get(GetParkingStatsUseCase) as any;
    managerUseCase = module.get(GetManagerStatsUseCase) as any;
  });

  describe('getParkingStats()', () => {
    it('should return parking stats from the use-case', async () => {
      const fake: ParkingStatsDto = {
        totalSlots: 60,
        reservedToday: 15,
        checkedInToday: 10,
        chargerUsagePct: 50,
      };
      parkingUseCase.execute.mockResolvedValue(fake);

      const result = await controller.getParkingStats();
      expect(parkingUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(fake);
    });

    it('should propagate errors from the use-case', async () => {
      parkingUseCase.execute.mockRejectedValue(new Error('boom'));
      await expect(controller.getParkingStats()).rejects.toThrow('boom');
      expect(parkingUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('getManagerStats()', () => {
    it('should return manager stats from the use-case', async () => {
      const fake: ManagerStatsDto = {
        totalSlots: 60,
        avgOccupancyPct: 72,
        noShowPct: 8,
        chargerSlotsPct: 33,
        reservationsLastWeek: 215,
        reservedToday: 10,
        checkedInToday: 5,
      };
      managerUseCase.execute.mockResolvedValue(fake);

      const result = await controller.getManagerStats();
      expect(managerUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(fake);
    });

    it('should propagate errors from the manager use-case', async () => {
      managerUseCase.execute.mockRejectedValue(new Error('fail'));
      await expect(controller.getManagerStats()).rejects.toThrow('fail');
      expect(managerUseCase.execute).toHaveBeenCalled();
    });
  });
});
