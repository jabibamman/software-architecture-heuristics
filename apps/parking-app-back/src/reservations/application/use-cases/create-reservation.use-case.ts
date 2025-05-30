import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ReservationRepositoryPort } from '../ports/reservation.repository.port';
import { ReservationCreationDto, ReservationResponseDto } from '../dtos';
import { ReservationPolicy } from '../../domain/services/reservation-policy';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationCreatedEvent } from '../../domain/events';
import { User } from '@/users/domain/entities/user.entity';
import { EventPublisher } from '@/common/messaging/ports/event-publisher.port';
import { SlotId } from '../../domain/value-objects/slot-id';
import { ReservationBadRequestException } from '../../domain/exceptions';

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject('ReservationRepositoryPort')
    private readonly reservationRepo: ReservationRepositoryPort,
    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(
    dto: ReservationCreationDto,
    currentUser: User,
  ): Promise<ReservationResponseDto> {
    let slotIdVo: SlotId;

    try {
      slotIdVo = SlotId.create(dto.slotId);
    } catch (err) {
      throw new ReservationBadRequestException(err.message);
    }

    const reservation = Reservation.create(
      currentUser.id,
      dto.slotId,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.needsCharger,
      dto.notes,
    );

    try {
      ReservationPolicy.validateReservation(reservation);
    } catch (err) {
      throw new ReservationBadRequestException(err.message);
    }

    const saved = await this.reservationRepo.save(reservation);
    this.eventPublisher.publish(new ReservationCreatedEvent(saved));

    return ReservationResponseDto.fromEntity(saved);
  }
}
