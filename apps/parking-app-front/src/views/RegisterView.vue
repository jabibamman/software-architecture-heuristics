<template>
  <div class="flex h-screen">
    <div class="w-1/2 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
    </div>
    <div class="w-1/2 flex items-center justify-center bg-white">
      <div class="w-full max-w-md p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Register</h2>
        <form @submit.prevent="onSubmit">
          <label class="block mb-4">
            <span class="text-gray-700">Name</span>
            <input v-model="name" type="text" required class="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2" />
          </label>
          <label class="block mb-4">
            <span class="text-gray-700">Email</span>
            <input v-model="email" type="email" required class="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2" />
          </label>
          <label class="block mb-4">
            <span class="text-gray-700">Password</span>
            <input v-model="password" :type="showPassword ? 'text' : 'password'" required class="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2" />
          </label>
          <label class="block mb-6">
            <span class="text-gray-700">Confirm Password</span>
            <input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" required class="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2" />
            <button type="button" @click="showPassword = !showPassword" class="mt-1 text-sm text-teal-600">
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </label>
          <button type="submit" class="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Sign Up</button>
        </form>
        <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/auth.service'
import {useAuthStore} from "@/stores/useAuthStore";

const router = useRouter()
const auth = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  try {
    const { data } = await authService.register({ name: name.value, mail: mail.value, password: password.value })
    auth.token = data.token
    auth.user = data.user
    localStorage.setItem('token', data.token)
    router.push({ name: 'reservations' })
  } catch (e) {
    error.value = e.response?.data?.message || 'Registration failed'
  }
}
</script>

<style>
</style>
