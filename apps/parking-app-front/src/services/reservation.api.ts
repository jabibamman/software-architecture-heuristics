import api from '@/services/api'
import type { Slot } from '@/types/reservations'
import type { ReservationCreation, ReservationResponse } from '@/types/reservations'

export function createReservation(data: ReservationCreation): Promise<ReservationResponse> {
  return api.post('/reservation', data).then((r) => r.data)
}

export function getReservations(): Promise<ReservationResponse[]> {
  return api.get('/reservation').then((r) => r.data)
}

export function getReservation(id: string): Promise<ReservationResponse> {
  return api.get(`/reservation/${id}`).then((r) => r.data)
}

export function checkInReservation(id: string): Promise<ReservationResponse> {
  return api.post(`/reservation/${id}/checkin`, { id }).then((r) => r.data)
}
