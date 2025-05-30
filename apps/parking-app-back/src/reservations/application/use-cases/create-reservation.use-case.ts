import { BadRequestException, Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ReservationRepositoryPort } from '../ports/reservation.repository.port';
import { ReservationCreationDto } from '../dtos/reservation-creation.dto';
import { ReservationPolicy } from '../../domain/services/reservation-policy';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationResponseDto } from '../dtos/reservation-response.dto';
import { ReservationCreatedEvent } from '../../domain/events/reservation-created.event';
import { User } from '@/users/domain/entities/user.entity';
import { EventPublisher } from '@/common/messaging/ports/event-publisher.port';
import { SlotId } from '../../domain/value-objects/slot-id';

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
      throw new BadRequestException(err.message);
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
      throw new BadRequestException(err.message);
    }

    const saved = await this.reservationRepo.save(reservation);
    this.eventPublisher.publish(new ReservationCreatedEvent(saved));

    return ReservationResponseDto.fromEntity(saved);
  }
}
