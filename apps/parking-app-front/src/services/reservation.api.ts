import api from '@/services/api'
import type { ReservationCreation, ReservationResponse } from '@/types/reservations'

export function createReservation(data: ReservationCreation): Promise<ReservationResponse> {
  return api.post('/reservation', data).then((r) => r.data)
}

export function getReservations(): Promise<ReservationResponse[]> {
  return api.get('/reservation').then((r) => r.data)
}
