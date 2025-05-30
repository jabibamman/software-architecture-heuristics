import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ReservationRepositoryPort } from '../ports/reservation.repository.port';
import { ReservationCreationDto, ReservationResponseDto } from '../dtos';
import { ReservationPolicy } from '../../domain/services/reservation-policy';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationCreatedEvent } from '../../domain/events';
import { EventPublisher } from '@/common/messaging/ports/event-publisher.port';
import { SlotId } from '../../domain/value-objects/slot-id';
import { ReservationBadRequestException } from '../../domain/exceptions';
import { JwtPayload } from '@/modules/auth/application/dtos/jwt-payload';
import { GetUserByEmailUseCase } from '@/modules/users/application/use-cases/get-user-by-email.use-case';

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject('ReservationRepositoryPort')
    private readonly reservationRepo: ReservationRepositoryPort,
    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisher,
    private readonly findUserByEmailUseCase: GetUserByEmailUseCase,
  ) {}

  async execute(
    dto: ReservationCreationDto,
    payload: JwtPayload,
  ): Promise<ReservationResponseDto> {
    let slotIdVo: SlotId;

    try {
      slotIdVo = SlotId.create(dto.slotId);
    } catch (err) {
      throw new ReservationBadRequestException(err.message);
    }

    const user = await this.findUserByEmailUseCase.execute(payload.email, {
      throwIfNotFound: true,
    });

    const reservation = Reservation.create(
      user!.id,
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
