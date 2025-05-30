import { Module } from '@nestjs/common';
import { StatsController } from './interface/http/stats.controller';
import { GetParkingStatsUseCase } from './application/use-cases/get-parking-stats.use-case';
import { GetManagerStatsUseCase } from './application/use-cases/get-manager-stats.use-case';

@Module({
  imports: [],
  controllers: [StatsController],
  providers: [GetParkingStatsUseCase, GetManagerStatsUseCase],
  exports: [],
})
export class StatsModule {}
