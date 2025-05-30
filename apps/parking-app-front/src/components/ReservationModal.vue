<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-2xl shadow-lg w-11/12 max-w-3xl p-6 mx-auto">
      <h2 class="text-2xl font-semibold mb-4">New Reservation</h2>

      <form @submit.prevent="submitReservation" class="space-y-4">
        <!-- Dates -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium">Start</label>
            <input
              v-model="startDate"
              type="datetime-local"
              class="mt-1 w-full border rounded p-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium">End</label>
            <input
              v-model="endDate"
              type="datetime-local"
              class="mt-1 w-full border rounded p-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              v-model="needsCharger"
              class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm">Needs Charger</span>
          </label>
        </div>
        <div>
          <label class="block text-sm font-medium">Notes (optional)</label>
          <textarea
            v-model="notes"
            rows="3"
            class="mt-1 w-full border rounded p-2 focus:ring-indigo-500"
            placeholder="Any special request..."
          ></textarea>
        </div>

        <!-- Slots grid -->
        <div v-if="loadingSlots" class="text-gray-500">Loading slots…</div>
        <div v-else-if="slotsError" class="text-red-600">{{ slotsError }}</div>
        <div v-else class="grid grid-rows-6 grid-cols-10 gap-2 my-4">
          <template v-for="row in rows" :key="row">
            <button
              v-for="col in cols"
              :key="`${row}${col}`"
              :class="buttonClass(slotsMap[`${row}${col}`])"
              :disabled="!slotsMap[`${row}${col}`] || slotsMap[`${row}${col}`].reserved"
              @click.prevent="selectSlot(`${row}${col}`)"
            >
              {{ row }}{{ col }}
            </button>
          </template>
        </div>

        <!-- Form error -->
        <p v-if="formError" class="text-red-600 text-sm">{{ formError }}</p>

        <!-- Actions -->
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="close()"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!selectedSlot || submitting"
            class="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            {{ submitting ? 'Reserving…' : 'Reserve' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { createReservation } from '@/services/reservation.api'
import { fetchParkingSlots } from '@/services/parking.api'
import type { Slot, ReservationCreation } from '@/types/reservations'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const startDate    = ref<string>('')
const endDate      = ref<string>('')
const needsCharger = ref<boolean>(false)
const notes        = ref<string>('')

const slots        = ref<Slot[]>([])
const loadingSlots = ref<boolean>(false)
const slotsError   = ref<string>('')
const selectedSlot = ref<string | null>(null)

const submitting   = ref<boolean>(false)
const formError    = ref<string>('')

const rows = ['A','B','C','D','E','F']
const cols = Array.from({ length: 10 }, (_, i) => String(i+1).padStart(2,'0'))

const slotsMap = computed<Record<string, Slot>>(() =>
  slots.value.reduce((m, s) => ((m[s.id] = s), m), {} as Record<string, Slot>)
)

watch(startDate, async (s) => {
  selectedSlot.value = null
  formError.value = ''
  if (!s) return
  loadingSlots.value = true
  slotsError.value   = ''
  try {
  const date = s.split('T')[0]
    slots.value = await fetchParkingSlots(date)
  } catch (err: any) {
    slotsError.value = err.response?.data?.message || 'Failed to load slots'
  } finally {
    loadingSlots.value = false
  }
}, { immediate: false })

function buttonClass(slot?: Slot) {
  const base = 'w-full py-1 rounded border text-sm'
  if (!slot)                          return `${base} bg-gray-200 cursor-not-allowed`
  if (slot.reserved)                  return `${base} bg-red-200 cursor-not-allowed`
  if (selectedSlot.value === slot.id) return `${base} bg-indigo-600 text-white`
  return `${base} bg-green-100 hover:bg-green-200`
}

function selectSlot(id: string) {
  if (!slotsMap.value[id] || slotsMap.value[id].reserved) return
  selectedSlot.value = selectedSlot.value === id ? null : id
}

async function submitReservation() {
  formError.value = ''
  if (!startDate.value || !endDate.value) {
    formError.value = 'Please specify start and end'
    return
  }
  if (!selectedSlot.value) {
    formError.value = 'Please choose a slot'
    return
  }

  submitting.value = true
  try {
    const payload: ReservationCreation = {
      slotId:       selectedSlot.value,
      startDate:    startDate.value,
      endDate:      endDate.value,
      needsCharger: needsCharger.value,
      notes:        notes.value || undefined,
    }
    await createReservation(payload)
    emit('created')
    close()
  } catch (err: any) {
    formError.value = err.response?.data?.message || 'Reservation failed'
  } finally {
    submitting.value = false
  }
}

function close() {
  startDate.value    = ''
  endDate.value      = ''
  needsCharger.value = false
  notes.value        = ''
  slots.value        = []
  selectedSlot.value = null
  slotsError.value   = ''
  formError.value    = ''
  emit('close')
}
</script>

<style scoped>
.grid { grid-auto-rows: minmax(2.5rem, auto); }
button { transition: background-color .2s; }
</style>