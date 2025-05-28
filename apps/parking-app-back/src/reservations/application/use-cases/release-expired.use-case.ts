import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from '../../../common/interface/use-case.interface';

@Injectable()
export class ReleaseExpiredReservationUseCase implements UseCaseInterface {
  constructor() {}

  execute(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
