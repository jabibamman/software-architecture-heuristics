<template>
  <div class="p-4">
    <div v-if="!props.reservations.length" class="text-center py-8 text-gray-500">
      No reservations found.
    </div>
    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="res in props.reservations"
        :key="res.id"
        class="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="font-semibold text-indigo-600">{{ res.slotId }}</span>
          <span class="text-sm text-gray-400">{{ formatDate(res.createdAt) }}</span>
        </div>
        <p><strong>From:</strong> {{ formatDate(res.startDate) }}</p>
        <p><strong>To:</strong> {{ formatDate(res.endDate) }}</p>
        <p>
          <strong>Charger:</strong>
          <span
            :class="res.needsCharger ? 'text-green-600' : 'text-red-600'"
          >
            {{ res.needsCharger ? 'Yes' : 'No' }}
          </span>
        </p>
        <p v-if="res.notes" class="mt-2 italic text-gray-600">"{{ res.notes }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { ReservationResponse } from '@/types/reservations';

const props = defineProps<{ reservations: ReservationResponse[] }>();

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
[ v-cloak ] { display: none; }
</style>