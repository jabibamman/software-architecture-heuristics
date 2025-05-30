import { Injectable, Inject } from '@nestjs/common';
import { ReservationRepositoryPort } from '../ports/reservation.repository.port';
import { CheckInReservationDto, ReservationResponseDto } from '../dtos';
import { ReservationPolicy } from '../../domain/services/reservation-policy';
import { ReservationCheckedInEvent } from '../../domain/events';
import { EventPublisher } from '@/common/messaging/ports/event-publisher.port';
import {
  ReservationBadRequestException,
  ReservationUnauthorizedException,
} from '../../domain/exceptions';
import { JwtPayload } from '@/modules/auth/application/dtos/jwt-payload';
import { GetUserByEmailUseCase } from '@/modules/users/application/use-cases/get-user-by-email.use-case';

@Injectable()
export class CheckInReservationUseCase {
  constructor(
    @Inject('ReservationRepositoryPort')
    private readonly repo: ReservationRepositoryPort,
    @Inject('EventPublisher')
    private readonly publisher: EventPublisher,
    private readonly findUserByEmailUseCase: GetUserByEmailUseCase,
  ) {}

  async execute(
    dto: CheckInReservationDto,
    payload: JwtPayload,
  ): Promise<ReservationResponseDto> {
    const reservation = await this.repo.findById(dto.id);

    const user = await this.findUserByEmailUseCase.execute(payload.email, {
      throwIfNotFound: true,
    });

    if (reservation?.userId !== user!.id) {
      throw new ReservationUnauthorizedException();
    }

    try {
      ReservationPolicy.assertCheckinAllowed(reservation!);
    } catch (err) {
      throw new ReservationBadRequestException(err.message);
    }

    reservation!.checkedIn = true;
    reservation!.checkedInAt = new Date();

    const saved = await this.repo.save(reservation);

    this.publisher.publish(new ReservationCheckedInEvent(saved));

    return ReservationResponseDto.fromEntity(saved);
  }
}
