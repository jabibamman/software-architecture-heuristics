import { defineStore } from 'pinia'
import type { ReservationCreation, ReservationResponse, Slot } from '@/types/reservations'
import {
  createReservation,
  getReservations,
  getReservation,
  checkInReservation,
  getAllReservations,
} from '@/services/reservation.api'
import { fetchParkingSlots } from '@/services/parking.api'

export const useReservationsStore = defineStore('reservations', {
  state: () => ({
    list: [] as ReservationResponse[],
    current: null as ReservationResponse | null,
    slots: [] as Slot[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUserReservations() {
      this.loading = true
      this.error = null
      try {
        this.list = await getReservations()
      } catch (e: any) {
        this.error = e.response?.data?.message || 'Erreur lors du chargement des réservations'
      } finally {
        this.loading = false
      }
    },

    async fetchAllReservations() {
      this.loading = true
      this.error = null
      try {
        this.list = await getAllReservations()
      } catch (e: any) {
        this.error = e.response?.data?.message || 'Erreur lors du chargement des réservations'
      } finally {
        this.loading = false
      }
    },

    async fetchOne(id: string) {
      this.loading = true
      this.error = null
      try {
        this.current = await getReservation(id)
      } catch (e: any) {
        this.error = e.response?.data?.message || 'Erreur lors du chargement de la réservation'
      } finally {
        this.loading = false
      }
    },

    async create(data: ReservationCreation) {
      this.loading = true
      this.error = null
      try {
        const created = await createReservation(data)
        this.list.unshift(created)
        return created
      } catch (e: any) {
        this.error = e.response?.data?.message || 'Erreur lors de la création'
        throw e
      } finally {
        this.loading = false
      }
    },

    async checkIn(id: string) {
      this.loading = true
      this.error = null
      try {
        const updated = await checkInReservation(id)
        this.list = this.list.map((r) => (r.id === id ? updated : r))
        if (this.current?.id === id) this.current = updated
        return updated
      } catch (e: any) {
        this.error = e.response?.data?.message || 'Erreur lors du check-in'
        throw e
      } finally {
        this.loading = false
      }
    },

    async loadSlots() {
      this.loading = true
      this.error = null
      try {
        const date = this.current?.startDate?.split('T')[0]
        this.slots = await fetchParkingSlots(date)
      } catch (e: any) {
        this.error = e.response?.data?.message || 'Erreur lors du chargement des places'
      } finally {
        this.loading = false
      }
    },
  },
})
