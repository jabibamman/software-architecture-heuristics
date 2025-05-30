import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { ReservationRepositoryPort } from '@/modules/reservations/application/ports/reservation.repository.port';
import { ReservationResponseDto } from '@/modules/reservations/application/dtos';
import { JwtPayload } from '@/modules/auth/application/dtos';

@Injectable()
export class GetReservationsByUserUseCase {
  constructor(
    @Inject('ReservationRepositoryPort')
    private readonly repo: ReservationRepositoryPort,
  ) {}

  async execute(payload: JwtPayload): Promise<ReservationResponseDto[]> {
    throw new NotImplementedException();
  }
}
