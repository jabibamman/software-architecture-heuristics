<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-white rounded-2xl shadow-lg w-11/12 max-w-md p-6 mx-auto">
      <h2 class="text-2xl font-semibold mb-4">New Reservation</h2>
      <form @submit.prevent="submitReservation" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">Slot ID</label>
          <input v-model="form.slotId" type="text" placeholder="A01" 
                 class="mt-1 w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium">Start Date</label>
          <input v-model="form.startDate" type="datetime-local" 
                 class="mt-1 w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium">End Date</label>
          <input v-model="form.endDate" type="datetime-local" 
                 class="mt-1 w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div class="flex items-center">
          <input v-model="form.needsCharger" type="checkbox" id="charger" 
                 class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          <label for="charger" class="ml-2 block text-sm">Needs Charger</label>
        </div>
        <div>
          <label class="block text-sm font-medium">Notes (optional)</label>
          <textarea v-model="form.notes" rows="3" 
                    class="mt-1 w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" @click="close()" 
                  class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
          <button type="submit" 
                  class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Reserve</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue';
import { createReservation } from '@/services/reservation.api';
import type { ReservationCreation, ReservationResponse } from '@/types/reservations';

const props = defineProps<{ show: boolean }>();
const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'created', payload: ReservationResponse): void;
}>();
const form: ReservationCreation = reactive({
  slotId: '',
  startDate: '',
  endDate: '',
  needsCharger: false,
  notes: ''
});

function close() {
  emits('close');
}

async function submitReservation() {
  try {
    const res = await createReservation(form);
    emits('created', res);
    close();
  } catch (err) {
    console.error(err);
    alert('Failed to create reservation');
  }
}
</script>
