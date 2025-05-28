import { Controller, Get } from '@nestjs/common';
import { GetParkingStatsUseCase } from '../../application/use-cases/get-parking-stats.use-case';

@Controller('stats')
export class StatsController {
  constructor(
    private readonly getParkingStatsUseCase: GetParkingStatsUseCase,
  ) {}

  @Get()
  getParkingStats(): Promise<void> {
    return this.getParkingStatsUseCase.execute();
  }
}
