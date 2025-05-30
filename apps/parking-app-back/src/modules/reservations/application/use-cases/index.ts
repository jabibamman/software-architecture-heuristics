import { CheckInReservationUseCase } from './checkin-reservation.use-case';
import { CreateReservationUseCase } from './create-reservation.use-case';
import { GetReservationUseCase } from './get-reservation.use-case';
import { GetReservationsUseCase } from './get-reservations.use-case';
import { ReleaseExpiredReservationsUseCase } from './release-expired.use-case';

export const useCases = [
  GetReservationUseCase,
  GetReservationsUseCase,
  CheckInReservationUseCase,
  CreateReservationUseCase,
  ReleaseExpiredReservationsUseCase,
];

export {
  GetReservationUseCase,
  GetReservationsUseCase,
  CheckInReservationUseCase,
  CreateReservationUseCase,
  ReleaseExpiredReservationsUseCase,
};
