import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from '../../../common/interface/use-case.interface';
import { ReservationCreationDto, ReservationResponseDto } from '../dtos';

@Injectable()
export class CreateReservationUseCase implements UseCaseInterface {
  constructor() {}

  execute(dto: ReservationCreationDto): Promise<ReservationResponseDto> {
    throw new Error('Method not implemented.');
  }
}
