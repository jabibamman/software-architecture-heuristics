import { Injectable, Inject } from '@nestjs/common';
import { ReservationRepositoryPort } from '../ports/reservation.repository.port';
import { CheckInReservationDto, ReservationResponseDto } from '../dtos';
import { User } from '@/users/domain/entities/user.entity';
import { ReservationPolicy } from '../../domain/services/reservation-policy';
import { ReservationCheckedInEvent } from '../../domain/events';
import { EventPublisher } from '@/common/messaging/ports/event-publisher.port';
import {
  ReservationBadRequestException,
  ReservationUnauthorizedException,
} from '../../domain/exceptions';

@Injectable()
export class CheckInReservationUseCase {
  constructor(
    @Inject('ReservationRepositoryPort')
    private readonly repo: ReservationRepositoryPort,
    @Inject('EventPublisher')
    private readonly publisher: EventPublisher,
  ) {}

  async execute(
    dto: CheckInReservationDto,
    currentUser: User,
  ): Promise<ReservationResponseDto> {
    const reservation = await this.repo.findById(dto.id);

    if (reservation?.userId !== currentUser.id) {
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
