// src/main.ts
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import {useAuthStore} from "@/stores/useAuthStore.ts";

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const auth = useAuthStore()
auth.initialize()

app.use(router)
app.mount('#app')
