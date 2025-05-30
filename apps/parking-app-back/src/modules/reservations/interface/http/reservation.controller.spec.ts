import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import {
  CheckInReservationUseCase,
  CreateReservationUseCase,
  GetReservationsByUserUseCase,
  GetReservationsUseCase,
  GetReservationUseCase,
} from '@/modules/reservations/application/use-cases';
import { JwtPayload } from '@/modules/auth/application/dtos';
import { User } from '@/modules/users/domain/entities/user.entity';
import {
  CheckInReservationDto,
  ReservationCreationDto,
} from '@/modules/reservations/application/dtos';

describe('ReservationController', () => {
  let controller: ReservationController;

  const createReservationUseCase = { execute: jest.fn() };
  const getReservationUseCase = { execute: jest.fn() };
  const getReservationsUseCase = { execute: jest.fn() };
  const getReservationsByUserUseCase = { execute: jest.fn() };
  const checkInReservationUseCase = { execute: jest.fn() };

  const dummyUser = JwtPayload.from({
    id: 'user-123',
    email: 'john@example.com',
  } as User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: CreateReservationUseCase,
          useValue: createReservationUseCase,
        },
        { provide: GetReservationUseCase, useValue: getReservationUseCase },
        { provide: GetReservationsUseCase, useValue: getReservationsUseCase },
        {
          provide: GetReservationsByUserUseCase,
          useValue: getReservationsByUserUseCase,
        },
        {
          provide: CheckInReservationUseCase,
          useValue: checkInReservationUseCase,
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReservation', () => {
    it('should call createReservationUseCase with correct parameters', async () => {
      const dummyReservation = {
        id: 'r-1',
        slotId: 'A01',
        startDate: '2025-06-01T09:00:00Z',
        endDate: '2025-06-01T17:00:00Z',
        needsCharger: false,
        checkedIn: false,
        checkedInAt: null,
        createdAt: '2025-05-30T08:00:00Z',
        updatedAt: '2025-05-30T08:00:00Z',
      } as ReservationCreationDto;
      await controller.createReservation(dummyUser, dummyReservation);
      expect(createReservationUseCase.execute).toHaveBeenCalledWith(
        dummyReservation,
        dummyUser,
      );
    });
  });

  describe('getReservation', () => {
    it('should call getReservationUseCase with correct id', async () => {
      const reservationId = 'r-1';
      await controller.getReservation(reservationId);
      expect(getReservationUseCase.execute).toHaveBeenCalledWith(reservationId);
    });
  });

  describe('getAllReservations', () => {
    it('should call getReservationsUseCase', async () => {
      await controller.getAllReservations();
      expect(getReservationsUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('getReservationsForCurrentUser', () => {
    it('should call getReservationsByUserUseCase with current user', async () => {
      await controller.getReservationsForCurrentUser(dummyUser);
      expect(getReservationsByUserUseCase.execute).toHaveBeenCalledWith(
        dummyUser,
      );
    });
  });

  describe('checkInReservation', () => {
    it('should call checkInReservationUseCase with correct parameters', async () => {
      const checkInDto = { id: 'r-1' } as CheckInReservationDto;
      await controller.checkInReservation(dummyUser, checkInDto);
      expect(checkInReservationUseCase.execute).toHaveBeenCalledWith(
        checkInDto,
        dummyUser,
      );
    });
  });
});
