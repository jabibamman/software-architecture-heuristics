import { Module } from '@nestjs/common';
import { StatsController } from './interface/http/stats.controller';
import { GetParkingStatsUseCase } from './application/use-cases/get-parking-stats.use-case';

@Module({
  imports: [],
  controllers: [StatsController],
  providers: [GetParkingStatsUseCase],
  exports: [],
})
export class StatsModule {}
