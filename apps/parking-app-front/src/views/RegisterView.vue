<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white">
    <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6 text-center">Register</h2>
      <p class="text-sm text-center mb-4">
        Déjà un compte ?
        <router-link to="/login" class="text-indigo-600 hover:underline">
          Connectez-vous
        </router-link>
      </p>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <label class="block">
          <span class="text-gray-700">Name</span>
          <input
            v-model="name"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
        </label>
        <label class="block">
          <span class="text-gray-700">Email</span>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
        </label>
        <label class="block">
          <span class="text-gray-700">Password</span>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-2 px-2 text-sm text-green-600"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </label>
        <label class="block">
          <span class="text-gray-700">Confirm Password</span>
          <input
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            required
            class="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
        </label>
        <button
          type="submit"
          class="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Sign Up
        </button>
      </form>
      <p v-if="error" class="mt-4 text-red-600 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const error = ref('')

const router = useRouter()
const auth = useAuthStore()

async function onSubmit() {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value })
    router.push({ name: 'reservations' })
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Registration failed'
  }
}
</script>