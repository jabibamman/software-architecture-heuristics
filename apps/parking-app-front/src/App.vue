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
              v-for="link in visibleLinks"
              :key="link.path"
              :to="link.path"
              class="text-gray-600 hover:text-primary transition"
              active-class="text-primary font-semibold"
            >
              {{ link.label }}
            </RouterLink>
          </nav>
          <div v-if="auth.isAuthenticated" class="flex items-center space-x-4">
            <button
              @click="onLogout"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Logout
            </button>
          </div>
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
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { getHealth } from '@/services/health.api'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
const router = useRouter()

const allLinks = [
  { path: '/',            label: 'Home',         auth: 'any' },
  { path: '/about',       label: 'About',        auth: 'any' },
  { path: '/login',       label: 'Login',        auth: 'guest' },
  { path: '/register',    label: 'Register',     auth: 'guest' },
  { path: '/reservations',label: 'My Reservation', auth: 'user' },
  { path: '/reservations/all',label: 'All Reservations', auth: 'user' },
  { path: '/stats',       label: 'Stats',        auth: 'user' },
  { path: '/dashboard',   label: 'Dashboard',    auth: 'user' },
]

const visibleLinks = computed(() =>
  allLinks.filter(link =>
    link.auth === 'any'
    || (link.auth === 'guest' && !auth.isAuthenticated)
    || (link.auth === 'user' && auth.isAuthenticated)
  )
)

async function onLogout() {
  await auth.logout()
  router.push({ name: 'home' })
}

const status = ref<'OK' | 'KO' | 'PENDING'>('PENDING')
const statusLabel = computed(() => {
  return status.value === 'PENDING'
    ? 'Checking…'
    : status.value === 'OK'
    ? 'Online'
    : 'Offline'
})

onMounted(async () => {
  try {
    const res = await getHealth()
    status.value = res.status === 200 && res.data === 'UP' ? 'OK' : 'KO'
  } catch {
    status.value = 'KO'
  }
})

auth.initialize()
</script>

<style scoped>
:root {
  --color-primary: theme('colors.primary');
}
@keyframes bounce {
  0%,100% { transform: translateY(0) }
  50%    { transform: translateY(-4px) }
}
.animate-bounce {
  animation: bounce 1.5s infinite;
}
</style>