// apps/parking-app-front/src/types/reservation.ts
export interface ReservationCreation {
  slotId: string
  startDate: string // ISO or 'YYYY-MM-DDTHH:mm'
  endDate: string
  needsCharger: boolean
  notes?: string
}

export interface ReservationResponse {
  id: string
  slotId: string
  startDate: string
  endDate: string
  needsCharger: boolean
  createdAt: string
}
