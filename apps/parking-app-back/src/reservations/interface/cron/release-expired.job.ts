import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReleaseExpiredReservationsUseCase } from '../../application/use-cases/release-expired.use-case';

@Injectable()
export class ReleaseExpiredJob {
  constructor(
    private readonly releaseExpired: ReleaseExpiredReservationsUseCase,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_11AM)
  async handle() {
    await this.releaseExpired.execute();
  }
}
