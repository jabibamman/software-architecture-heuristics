import { Controller, Get } from '@nestjs/common';
import { GetParkingStatsUseCase } from '../../application/use-cases/get-parking-stats.use-case';
import { ParkingStatsDto } from '../../application/dtos/parking-stats.dto';

@Controller('stats')
export class StatsController {
  constructor(
    private readonly getParkingStatsUseCase: GetParkingStatsUseCase,
  ) {}

  @Get('/parking')
  getParkingStats(): Promise<ParkingStatsDto> {
    return this.getParkingStatsUseCase.execute();
  }
}
