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
  notes?: string
  checkedIn: boolean
  checkedInAt?: string
  createdAt: string
  updatedAt: string
}

export interface Slot {
  id: string
  reserved: boolean
}
