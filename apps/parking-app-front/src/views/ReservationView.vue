<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Reservations</h1>
      <button
        @click="showModal = true"
        class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition"
      >
        <PlusIcon class="h-5 w-5"/>
        New Reservation
      </button>
    </div>

    <ReservationModal
      :show="showModal"
      @close="showModal = false"
      @created="onCreated"
    />

    <div v-if="store.loading" class="text-center py-8">Loading…</div>
    <div v-else-if="store.error" class="text-red-600 py-8">{{ store.error }}</div>

    <ReservationList
      v-else
      :reservations="store.list"
      @check-in="onCheckIn"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReservationsStore } from '@/stores/useReservationsStore'
import ReservationModal from '@/components/ReservationModal.vue'
import ReservationList from '@/components/ReservationList.vue'
import { PlusIcon } from 'lucide-vue-next'

const showModal = ref(false)
const store = useReservationsStore()

onMounted(() => {
  store.fetchAll()
})

function onCreated() {
  showModal.value = false
  store.fetchAll()
}

async function onCheckIn(id: string) {
  try {
    await store.checkIn(id)
  } catch {

  }
}
</script>

<style scoped>
</style>