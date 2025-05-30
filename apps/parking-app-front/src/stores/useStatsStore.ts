import { defineStore } from 'pinia'
import type { ParkingStats } from '@/types/stats'
import { fetchParkingStats } from '@/services/stats.api'

export const useStatsStore = defineStore('stats', {
  state: () => ({
    data: null as ParkingStats | null,
    loading: false,
    error: '' as string,
  }),
  getters: {
    stats: (state) => state.data,
  },
  actions: {
    async load() {
      this.loading = true
      this.error = ''
      try {
        this.data = await fetchParkingStats()
      } catch (e: any) {
        this.error = e.response?.data?.message || 'Failed to load stats'
      } finally {
        this.loading = false
      }
    },
  },
})
