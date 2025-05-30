<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <h1 class="text-4xl font-bold text-gray-800 mb-6">Tableau de bord Manager</h1>

    <div v-if="loading" class="text-gray-500">Chargement…</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div v-else-if="!stats">
      <p class="text-yellow-600">Aucune donnée disponible.</p>
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(card, index) in cards"
        :key="card.label || index"
        @click="openModal(index)"
        class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
      >
        <div class="flex items-center justify-between mb-4">
          <component v-if="card.icon" :is="card.icon" class="w-8 h-8 text-indigo-600" />
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

    <DashboardCardModal
      v-if="selectedCard !== null && cards[selectedCard]"
      :card="cards[selectedCard]"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/useDashboardStore'
import { BarChart2, Activity, Calendar, CheckCircle, Zap } from 'lucide-vue-next'
import DashboardCardModal from '@/components/DashboardCardModal.vue'

const store = useDashboardStore()
const { stats, loading, error } = storeToRefs(store)

onMounted(() => {
  store.loadStats()
})

watch(stats, (val) => {
  console.log('Nouvelles stats:', val)
})

const selectedCard = ref<number | null>(null)
const openModal = (index: number) => {
  selectedCard.value = index
}
const closeModal = () => {
  selectedCard.value = null
}

const cards = computed(() => {
  const data = stats.value
  if (!data) return []

  return [
    {
      label: 'Total de places',
      icon: BarChart2,
      value: data.totalSlots,
      details: [
        'Ce chiffre représente le nombre total de places disponibles.',
        'Vérifiez régulièrement l’exactitude pour refléter les travaux ou fermetures.',
      ],
    },
    {
      label: 'Réservé aujourd’hui',
      icon: Calendar,
      value: data.reservedToday,
      secondary: `${Math.round((data.reservedToday / data.totalSlots) * 100)}%`,
      details: [
        'Nombre de places réservées aujourd’hui.',
        `Cela représente une occupation de ${Math.round((data.reservedToday / data.totalSlots) * 100)}%.`,
        "Un bon indicateur d'activité quotidienne.",
      ],
    },
    {
      label: 'Check-in aujourd’hui',
      icon: CheckCircle,
      value: data.checkedInToday,
      secondary: `${Math.round((data.checkedInToday / data.reservedToday) * 100)}%`,
      details: [
        'Utilisateurs ayant réellement utilisé leur réservation.',
        "Ce taux montre la fidélité et l'engagement des usagers.",
        'Favoriser les check-ins par des rappels ou récompenses.',
      ],
    },
    {
      label: 'Taux de no-show',
      icon: Activity,
      value: data.noShowPct,
      suffix: '%',
      details: [
        'Pourcentage de réservations non utilisées.',
        'Un taux élevé peut perturber l’organisation et causer des pertes.',
        'Considérez des alertes ou pénalités après plusieurs no-shows.',
      ],
    },
    {
      label: 'Places avec bornes',
      icon: Zap,
      value: data.chargerSlotsPct,
      suffix: '%',
      details: [
        'Proportion de places équipées de bornes électriques.',
        'Indicateur important pour la transition écologique.',
        'Cible recommandée : minimum 25% à terme.',
      ],
    },
    {
      label: 'Réservations (sem.)',
      icon: BarChart2,
      value: data.reservationsLastWeek,
      details: [
        'Total de réservations effectuées sur les 7 derniers jours.',
        'Permet d’évaluer les tendances hebdomadaires.',
        'Idéal pour ajuster la communication ou les capacités.',
      ],
    },
  ]
})
</script>
