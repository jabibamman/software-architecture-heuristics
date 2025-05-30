import { defineStore } from 'pinia'
import type { ManagerStats } from '@/types/dashboard'
import { fetchManagerStats } from '@/services/dashboard.api'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: null as ManagerStats | null,
    loading: false,
    error: '' as string,
  }),
  actions: {
    async loadStats() {
      this.loading = true
      this.error = ''
      try {
        this.stats = await fetchManagerStats()
        console.log('this.stats', this.stats)
      } catch (e: any) {
        this.error = e.message || 'Erreur de chargement'
      } finally {
        this.loading = false
      }
    },
  },
})
