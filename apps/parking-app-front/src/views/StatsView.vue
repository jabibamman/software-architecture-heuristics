<template>
  <div class="space-y-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <Gauge class="w-8 h-8 text-indigo-600 animate-bounce" />
      Parking Stats
    </h2>

    <div v-if="loading" class="text-gray-500">Loading…</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="stats" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="p-6 bg-white rounded-2xl shadow flex flex-col items-center">
        <Users class="w-10 h-10 text-indigo-500 mb-2" />
        <div class="text-xl font-semibold">{{ stats.totalSlots }}</div>
        <div class="text-gray-500">Total Slots</div>
      </div>

      <div class="p-6 bg-white rounded-2xl shadow flex flex-col items-center">
        <Calendar class="w-10 h-10 text-green-500 mb-2" />
        <div class="text-xl font-semibold">{{ stats.reservedToday }}</div>
        <div class="text-gray-500">Reserved Today</div>
      </div>

      <div class="p-6 bg-white rounded-2xl shadow flex flex-col items-center">
        <CheckCircle class="w-10 h-10 text-blue-500 mb-2" />
        <div class="text-xl font-semibold">{{ stats.checkedInToday }}</div>
        <div class="text-gray-500">Checked-In Today</div>
      </div>

      <div class="p-6 bg-white rounded-2xl shadow flex flex-col items-center">
        <Zap class="w-10 h-10 text-yellow-500 mb-2" />
        <div class="text-xl font-semibold">{{ stats.chargerUsagePct }}%</div>
        <div class="text-gray-500">Charger Usage</div>
      </div>
    </div>
    <div v-else class="text-gray-500">No data available</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useStatsStore } from '@/stores/useStatsStore'

import { Gauge, Users, Calendar, CheckCircle, Zap } from 'lucide-vue-next'

const store = useStatsStore()
const { stats, loading, error } = storeToRefs(store)
onMounted(() => store.load())

</script>

<style scoped>
.animate-bounce {
  animation: bounce 1.5s infinite;
}
@keyframes bounce {
  0%,100% { transform: translateY(0) }
  50%    { transform: translateY(-4px) }
}
</style>