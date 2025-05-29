import { NotFoundException } from '@nestjs/common';
import { GetReservationUseCase } from '../get-reservation.use-case';
import { ReservationRepositoryPort } from '../../ports/reservation.repository.port';
import { ReservationResponseDto } from '../../dtos/reservation-response.dto';
import { Reservation } from '../../../domain/entities/reservation.entity';

describe('GetReservationUseCase', () => {
  let useCase: GetReservationUseCase;
  let repo: jest.Mocked<ReservationRepositoryPort>;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    } as any;
    useCase = new GetReservationUseCase(repo);
  });

  it('retourne le DTO quand la réservation existe', async () => {
    const entity = Object.assign(new Reservation(), {
      id: 'r-1',
      slotId: 'A01',
      startDate: new Date('2025-06-01T09:00:00Z'),
      endDate: new Date('2025-06-01T17:00:00Z'),
      needsCharger: false,
      checkedIn: false,
      checkedInAt: null,
      createdAt: new Date('2025-05-30T08:00:00Z'),
      updatedAt: new Date('2025-05-30T08:00:00Z'),
    });
    repo.findById.mockResolvedValue(entity);

    const dto = await useCase.execute('r-1');
    expect(repo.findById).toHaveBeenCalledWith('r-1');
    expect(dto).toEqual(ReservationResponseDto.fromEntity(entity));
  });

  it('throw NotFoundException quand la réservation est introuvable', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(useCase.execute('nope')).rejects.toThrowError(
      NotFoundException,
    );
  });
});
