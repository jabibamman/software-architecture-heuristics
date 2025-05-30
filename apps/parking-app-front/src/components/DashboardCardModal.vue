<template>
  <transition name="modal-fade">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-scale-in">
        <button
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
          @click="$emit('close')"
        >
          <XIcon class="w-5 h-5" />
        </button>

        <div class="flex justify-center mb-4">
          <div class="bg-indigo-100 text-indigo-600 rounded-full p-3">
            <component :is="card.icon" class="w-6 h-6" />
          </div>
        </div>

        <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">{{ card.label }}</h2>

        <p class="text-center text-gray-700 text-lg mb-1">
          <span class="font-semibold text-indigo-600 text-xl">
            {{ card.value }}{{ card.suffix || '' }}
          </span>
        </p>
        <p v-if="card.secondary" class="text-center text-sm text-gray-500 mb-4">
          {{ card.secondary }}
        </p>

        <div class="text-sm text-gray-700 space-y-2">
          <p v-for="(line, index) in card.details" :key="index" class="flex items-start gap-2">
            <ChevronRightIcon class="w-4 h-4 text-indigo-500 mt-1 shrink-0" />
            <span>{{ line }}</span>
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { XIcon, ChevronRightIcon } from 'lucide-vue-next'

defineProps<{
  card: {
    label: string
    value: number | string
    suffix?: string
    secondary?: string
    details: string[]
    icon?: any
  }
}>()

defineEmits(['close'])
</script>

<style scoped>
@keyframes scale-in {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-scale-in {
  animation: scale-in 0.25s ease-out forwards;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
