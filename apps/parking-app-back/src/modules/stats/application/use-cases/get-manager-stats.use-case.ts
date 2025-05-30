import { Injectable } from '@nestjs/common';
import { ManagerStatsDto } from '../dtos/manager-stats.dto';

@Injectable()
export class GetManagerStatsUseCase {
  async execute(): Promise<ManagerStatsDto> {
    return {
      totalSlots: 60,
      avgOccupancyPct: 72,
      noShowPct: 8,
      chargerSlotsPct: 33,
      reservationsLastWeek: 215,
      reservedToday: 10,
      checkedInToday: 5,
    };
  }
}
