import api from '@/services/api'
import type { ParkingStats } from '@/types/stats'

export function fetchParkingStats(): Promise<ParkingStats> {
  return api.get('/stats/parking').then((r) => r.data)
}
