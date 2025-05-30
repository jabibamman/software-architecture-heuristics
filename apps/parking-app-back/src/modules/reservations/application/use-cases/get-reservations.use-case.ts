import { Inject, Injectable } from '@nestjs/common';
import { ReservationResponseDto } from '../dtos/reservation-response.dto';
import { ReservationRepositoryPort } from '../ports/reservation.repository.port';

@Injectable()
export class GetReservationsUseCase {
  constructor(
    @Inject('ReservationRepositoryPort')
    private readonly repo: ReservationRepositoryPort,
  ) {}

  async execute(): Promise<ReservationResponseDto[]> {
    const reservations = await this.repo.findAll();
    return reservations.map((r) => ReservationResponseDto.fromEntity(r));
  }
}
