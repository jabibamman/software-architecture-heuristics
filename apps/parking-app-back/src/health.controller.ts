import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('health')
export class HealthController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthCheck(): string {
    return this.appService.getHealthCheck();
  }
}
