<template>
  <div class="flex h-screen">
    <div class="w-1/2 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
      <img src="@/assets/3d-cube.png" alt="3D Cube" class="max-w-xs" />
    </div>
    <div class="w-1/2 flex items-center justify-center bg-white">
      <div class="w-full max-w-md p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Log In</h2>
        <form @submit.prevent="onSubmit">
          <label class="block mb-4">
            <span class="text-gray-700">Email</span>
            <input v-model="email" type="email" required class="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2" />
          </label>
          <label class="block mb-6">
            <span class="text-gray-700">Password</span>
            <input v-model="password" :type="show ? 'text' : 'password'" required class="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2" />
            <button type="button" @click="show = !show" class="mt-1 text-sm text-indigo-600">
              {{ show ? 'Hide' : 'Show' }}
            </button>
          </label>
          <button type="submit" class="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Sign In</button>
        </form>
        <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()

const router = useRouter()

const email = ref('')
const password = ref('')
const show = ref(false)
const error = ref('')



async function onSubmit() {
  await auth.login({ email: email.value, password: password.value })
}
</script>

<style>
</style>
