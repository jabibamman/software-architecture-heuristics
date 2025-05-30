import { Inject, Injectable } from '@nestjs/common';
import { ReservationResponseDto } from '../dtos';
import { ReservationRepositoryPort } from '../ports/reservation.repository.port';
import { ReservationNotFoundException } from '../../domain/exceptions';

@Injectable()
export class GetReservationUseCase {
  constructor(
    @Inject('ReservationRepositoryPort')
    private readonly repo: ReservationRepositoryPort,
  ) {}

  async execute(id: string): Promise<ReservationResponseDto> {
    const reservation = await this.repo.findById(id);
    if (!reservation) {
      throw new ReservationNotFoundException(id);
    }
    return ReservationResponseDto.fromEntity(reservation);
  }
}
