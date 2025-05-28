<template>
  <div class="min-h-screen flex flex-col bg-gray-50 font-sans">
    <header class="bg-white shadow-md">
      <div class="container mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="75" height="75" />
          <h1 class="text-2xl font-extrabold text-primary">ParkEase</h1>
        </div>
        <div class="flex items-center space-x-8">
          <nav class="space-x-4">
            <RouterLink
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="text-gray-600 hover:text-primary transition"
              active-class="text-primary font-semibold"
            >
              {{ link.label }}
            </RouterLink>
          </nav>
          <div
            class="flex items-center space-x-2 px-4 py-1 rounded-full"
            :class="{
              'bg-green-100 text-green-800': status === 'OK',
              'bg-red-100 text-red-800': status === 'KO',
              'bg-yellow-100 text-yellow-800': status === 'PENDING',
            }"
          >
            <span
              class="w-2 h-2 rounded-full"
              :class="{
                'bg-green-500': status === 'OK',
                'bg-red-500': status === 'KO',
                'bg-yellow-500': status === 'PENDING',
              }"
            ></span>
            <span class="text-sm font-medium">{{ statusLabel }}</span>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 container mx-auto px-6 py-8">
      <RouterView />
    </main>

    <footer class="bg-white border-t text-center py-4 text-gray-500 text-sm">
      © 2025 ParkEase – Built with ❤️ by Team ParkingApp
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { getHealth } from '@/services/health.api'
//import ParkLogo from '@/assets/park-logo.svg?component' // SVG as component

// Nav links
const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/login', label: 'Login' },
  { path: '/reservations', label: 'Reservations' },
]

// Health status
const status = ref<'OK' | 'KO' | 'PENDING'>('PENDING')
const statusLabel = computed(() => {
  return status.value === 'PENDING'
    ? 'Checking…'
    : status.value === 'OK'
    ? 'Online'
    : 'Offline'
})

// On mount, call health API
onMounted(async () => {
  try {
    const res = await getHealth()
    status.value = res.status === 200 && res.data === 'UP' ? 'OK' : 'KO'
  } catch {
    status.value = 'KO'
  }
})
</script>

<style lang="css" scoped>
/* Variables from tailwind.config.js */
:root {
  --color-primary: theme('colors.primary');
}

/* Ensure perfect bounce timing */
@keyframes bounce {
  0%, 100% { transform: translateY(0) }
  50% { transform: translateY(-4px) }
}
.animate-bounce {
  animation: bounce 1.5s infinite;
}
</style>
