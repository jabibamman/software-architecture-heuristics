import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ReservationRepositoryPort } from '../ports/reservation.repository.port';
import { ReservationResponseDto } from '../dtos/reservation-response.dto';

import { User } from '../../../users/domain/entities/user.entity';
import { ReservationPolicy } from '../../domain/services/reservation-policy';
import { CheckInReservationDto } from '../dtos/checkin-reservation.dto';
import { ReservationCheckedInEvent } from '../../domain/events/reservation-checked-in.event';
import { EventPublisher } from '@/common/messaging/ports/event-publisher.port';

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
      throw new BadRequestException(`Not your reservation`);
    }

    try {
      ReservationPolicy.assertCheckinAllowed(reservation!);
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    reservation!.checkedIn = true;
    reservation!.checkedInAt = new Date();

    const saved = await this.repo.save(reservation);

    this.publisher.publish(new ReservationCheckedInEvent(saved));

    return ReservationResponseDto.fromEntity(saved);
  }
}
