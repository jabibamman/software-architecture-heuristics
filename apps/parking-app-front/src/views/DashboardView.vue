<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <h1 class="text-4xl font-bold text-gray-800 mb-6">Tableau de bord Manager</h1>

    <div v-if="loading" class="text-gray-500">Chargement…</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="card in cards"
        :key="card.label"
        class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
      >
        <div class="flex items-center justify-between mb-4">
          <component :is="card.icon" class="w-8 h-8 text-indigo-600" />
          <div class="text-right">
            <div class="text-2xl font-semibold">
              {{ card.value }}<span v-if="card.suffix">{{ card.suffix }}</span>
            </div>
            <div v-if="card.secondary" class="text-sm text-gray-500">
              {{ card.secondary }}
            </div>
          </div>
        </div>
        <div class="text-gray-500">{{ card.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/useDashboardStore'
import { BarChart2, Activity, Calendar, CheckCircle, Zap } from 'lucide-vue-next'

const store = useDashboardStore()
const { stats, loading, error } = storeToRefs(store)

onMounted(() => store.loadStats())

const cards = computed(() => {
  if (!stats.value) return []
  return [
    {
      label: 'Total de places',
      icon: BarChart2,
      value: stats.value.totalSlots,
    },
    {
      label: 'Réservé aujourd’hui',
      icon: Calendar,
      value: stats.value.reservedToday,
      secondary: `${Math.round((stats.value.reservedToday / stats.value.totalSlots) * 100)}%`
    },
    {
      label: 'Check-in aujourd’hui',
      icon: CheckCircle,
      value: stats.value.checkedInToday,
      secondary: `${Math.round((stats.value.checkedInToday / stats.value.reservedToday) * 100)}%`
    },
    {
      label: 'Taux de no-show',
      icon: Activity,
      value: stats.value.noShowPct,
      suffix: '%'
    },
    {
      label: 'Places avec bornes',
      icon: Zap,
      value: stats.value.chargerSlotsPct,
      suffix: '%'
    },
    {
      label: 'Réservations (sem.)',
      icon: BarChart2,
      value: stats.value.reservationsLastWeek,
    },
  ]
})
</script>

<style scoped>
</style>