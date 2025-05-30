import type { Slot } from '@/types/reservations'
import api from './api'

export function fetchParkingSlots(date?: string): Promise<Slot[]> {
  const params = date ? { date } : {}
  return api.get<Slot[]>('/parking/slots', { params }).then((r) => r.data)
}
