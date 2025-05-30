import api from '@/services/api'
import type { ManagerStats } from '@/types/dashboard'
import type { ParkingStats } from '@/types/stats'

export function fetchParkingStats(): Promise<ParkingStats> {
  return api.get('/stats/parking').then((r) => r.data)
}

export function fetchManagerStats(): Promise<ManagerStats> {
  return api.get('/stats/manager').then((r) => r.data)
}
