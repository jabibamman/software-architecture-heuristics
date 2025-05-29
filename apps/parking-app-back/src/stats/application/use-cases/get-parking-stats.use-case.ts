import { Injectable } from '@nestjs/common';
import { ParkingStatsDto } from '../dtos/parking-stats.dto';

@Injectable()
export class GetParkingStatsUseCase {
  async execute(): Promise<ParkingStatsDto> {
    return {
      totalSlots: 60,
      reservedToday: 20,
      checkedInToday: 15,
      chargerUsagePct: 30,
    };
  }
}
