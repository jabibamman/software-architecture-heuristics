import type { ManagerStats } from '@/types/dashboard'

export function fetchManagerStats(): Promise<ManagerStats> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          totalSlots: 60,
          avgOccupancyPct: 72,
          noShowPct: 8,
          chargerSlotsPct: 33,
          reservationsLastWeek: 215,
          reservedToday: 10,
          checkedInToday: 5,
        }),
      300,
    )
  })
}
