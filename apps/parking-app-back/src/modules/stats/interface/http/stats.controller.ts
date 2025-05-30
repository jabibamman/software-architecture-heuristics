import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetParkingStatsUseCase } from '../../application/use-cases/get-parking-stats.use-case';
import { ParkingStatsDto } from '../../application/dtos/parking-stats.dto';
import { Role } from '@/modules/users/domain/value-objects/role.value-object';
import { ManagerStatsDto } from '../../application/dtos/manager-stats.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetManagerStatsUseCase } from '../../application/use-cases/get-manager-stats.use-case';
import { JwtAuthGuard, RolesGuard } from '@/common/guards';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(
    private readonly getParkingStatsUseCase: GetParkingStatsUseCase,
    private readonly getManagerStatsUseCase: GetManagerStatsUseCase,
  ) {}

  @Get('/parking')
  @ApiOperation({ summary: 'Public parking stats' })
  @ApiResponse({ status: 200, type: ParkingStatsDto })
  getParkingStats(): Promise<ParkingStatsDto> {
    return this.getParkingStatsUseCase.execute();
  }

  @Get('/manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Manager dashboard stats' })
  @ApiResponse({ status: 200, type: ManagerStatsDto })
  getManagerStats(): Promise<ManagerStatsDto> {
    return this.getManagerStatsUseCase.execute();
  }
}
