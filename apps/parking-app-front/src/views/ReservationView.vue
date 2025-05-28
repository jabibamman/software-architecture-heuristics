<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Reservations</h1>
      <button
        @click="showModal = true"
        class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4v16m8-8H4" />
        </svg>
        New Reservation
      </button>
    </div>

    <ReservationModal
      :show="showModal"
      @close="showModal = false"
      @created="onCreated"
    />

    <ReservationList :reservations="reservations" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ReservationModal from '@/components/ReservationModal.vue';
import ReservationList from '@/components/ReservationList.vue';
import type { ReservationResponse } from '@/types/reservations';
import { getReservations } from '@/services/reservation.api';

const showModal     = ref(false);
const reservations = ref<ReservationResponse[]>([]);

async function loadReservations() {
  try {
    reservations.value = await getReservations();
  } catch (err) {
    console.error('Error loading reservations', err);
  }
}

async function onCreated(newRes: ReservationResponse) {
  reservations.value.unshift(newRes);

  await loadReservations();
}

onMounted(loadReservations);
</script> 