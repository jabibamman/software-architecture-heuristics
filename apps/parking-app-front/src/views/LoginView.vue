<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br">
    <div class="w-full  p-8 bg-white rounded-xl shadow-lg">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6 text-center">Log In</h2>
      <p class="text-sm text-center mb-4">
        Pas de compte ?
        <router-link to="/register" class="text-indigo-600 hover:underline">
          Inscrivez-vous
        </router-link>
      </p>
      <form @submit.prevent="onSubmit">
        <label class="block mb-4">
          <span class="text-gray-700">Email</span>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
          />
        </label>

        <label class="block mb-6">
          <span class="text-gray-700">Password</span>
          <input
            v-model="password"
            :type="show ? 'text' : 'password'"
            required
            class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
          />
          <button
            type="button"
            @click="show = !show"
            class="mt-1 text-sm text-indigo-600"
          >
            {{ show ? 'Hide' : 'Show' }}
          </button>
        </label>

        <button
          type="submit"
          class="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Sign In
        </button>
      </form>

      <p v-if="error" class="mt-4 text-red-600 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {useAuthStore} from "@/stores/useAuthStore";

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

async function onSubmit() {
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push({ name: 'reservations' })
  } catch (e) {
    error.value = e.response?.data?.message || 'Login failed'
  }
}
</script>


<style>
</style>
