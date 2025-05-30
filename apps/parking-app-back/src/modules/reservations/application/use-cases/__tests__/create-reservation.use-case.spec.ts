import { User } from '@/modules/users/domain/entities/user.entity'
import { ReservationRepositoryPort } from '../../ports/reservation.repository.port'
import { EventPublisher } from '@/common/messaging/ports/event-publisher.port'
import { GetUserByEmailUseCase } from '@/modules/users/application/use-cases/get-user-by-email.use-case'
import { JwtPayload } from '@/modules/auth/application/dtos/jwt-payload'
import { CreateReservationUseCase } from '../create-reservation.use-case'
import { ReservationCreationDto } from '../../dtos/reservation-creation.dto'
import { Reservation } from '@/modules/reservations/domain/entities/reservation.entity'
import { ReservationCreatedEvent } from '@/modules/reservations/domain/events/reservation-created.event'
import { ReservationResponseDto } from '../../dtos/reservation-response.dto'
import { SlotId } from '@/modules/reservations/domain/value-objects/slot-id'
import { ReservationPolicy } from '@/modules/reservations/domain/services/reservation-policy'
import { ReservationBadRequestException } from '@/modules/reservations/domain/exceptions'
import { Role } from '@/modules/users/domain/value-objects/role.value-object'

describe('CreateReservationUseCase (with JWT payload.role)', () => {
  let useCase: CreateReservationUseCase
  let repo: jest.Mocked<ReservationRepositoryPort>
  let publisher: jest.Mocked<EventPublisher>
  let findUser: jest.Mocked<GetUserByEmailUseCase>
  let fakeUser: User
  let payload: JwtPayload

  beforeEach(() => {
    repo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as any
    publisher = { publish: jest.fn() } as any
    findUser = { execute: jest.fn() } as any

    useCase = new CreateReservationUseCase(repo, publisher, findUser)

    fakeUser = new User()
    fakeUser.id = 'user-123'
    fakeUser.email = 'alice@example.com'

    payload = JwtPayload.from(fakeUser)
    payload.role = Role.EMPLOYEE

    findUser.execute.mockResolvedValue(fakeUser)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('creates a reservation successfully for EMPLOYEE', async () => {
    const dto = Object.assign(new ReservationCreationDto(), {
      slotId: 'A01',
      startDate: '2025-06-01T09:00:00Z',
      endDate: '2025-06-01T17:00:00Z',
      needsCharger: false,
      notes: 'Test note',
    })

    const createSpy = jest.spyOn(SlotId, 'create')
    jest.spyOn(ReservationPolicy, 'validateReservation').mockImplementation(() => {})

    const entity = Reservation.create(
      fakeUser.id,
      dto.slotId,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.needsCharger,
      dto.notes,
    )
    entity.createdAt = new Date()
    entity.updatedAt = new Date()
    entity.checkedIn = false
    repo.save.mockResolvedValue(entity)

    const result = await useCase.execute(dto, payload)

    expect(createSpy).toHaveBeenCalledWith(dto.slotId)
    expect(findUser.execute).toHaveBeenCalledWith(payload.email, { throwIfNotFound: true })
    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: fakeUser.id,
        slotId: dto.slotId,
        notes: dto.notes,
      }),
    )
    expect(publisher.publish).toHaveBeenCalledWith(new ReservationCreatedEvent(entity))
    expect(result).toEqual(ReservationResponseDto.fromEntity(entity))
  })

  it('rejects when slotId is invalid', async () => {
    const dto = Object.assign(new ReservationCreationDto(), {
      slotId: 'Z99',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      needsCharger: false,
    })

    jest.spyOn(SlotId, 'create').mockImplementation(() => {
      throw new Error('invalid slot')
    })

    await expect(useCase.execute(dto, payload)).rejects.toThrow(
      new ReservationBadRequestException('invalid slot'),
    )
    expect(findUser.execute).not.toHaveBeenCalled()
    expect(repo.save).not.toHaveBeenCalled()
    expect(publisher.publish).not.toHaveBeenCalled()
  })

  it('rejects when business-rule validation fails', async () => {
    const dto = Object.assign(new ReservationCreationDto(), {
      slotId: 'A01',
      startDate: '2025-06-01T09:00:00Z',
      endDate: '2025-06-10T09:00:00Z',
      needsCharger: false,
    })

    jest.spyOn(SlotId, 'create')
    jest.spyOn(ReservationPolicy, 'validateReservation').mockImplementation(() => {
      throw new Error('too many days')
    })

    await expect(useCase.execute(dto, payload)).rejects.toThrow(
      new ReservationBadRequestException('too many days'),
    )
    expect(findUser.execute).toHaveBeenCalledWith(payload.email, { throwIfNotFound: true })
    expect(repo.save).not.toHaveBeenCalled()
    expect(publisher.publish).not.toHaveBeenCalled()
  })

  it('allows managers to book up to 30 business days', async () => {
    payload.role = Role.MANAGER

    const dto = Object.assign(new ReservationCreationDto(), {
      slotId: 'A01',
      startDate: '2025-06-01T09:00:00Z',
      endDate: '2025-07-15T09:00:00Z', // plus de 30 jours ouvrés
      needsCharger: false,
    })

    jest.spyOn(SlotId, 'create')
    jest.spyOn(ReservationPolicy, 'validateReservation').mockImplementation(() => {})

    const entity = Reservation.create(
      fakeUser.id,
      dto.slotId,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.needsCharger,
      dto.notes,
    )
    entity.createdAt = new Date()
    entity.updatedAt = new Date()
    entity.checkedIn = false
    repo.save.mockResolvedValue(entity)

    const result = await useCase.execute(dto, payload)

    expect(ReservationPolicy.validateReservation).toHaveBeenCalledWith(
      expect.any(Reservation),
      Role.MANAGER,
    )
    expect(result).toEqual(ReservationResponseDto.fromEntity(entity))
  })
})