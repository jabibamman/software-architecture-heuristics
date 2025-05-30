import { defineStore } from 'pinia'
import type {User} from "@/types/user.ts";
import authService from "@/services/auth.service.ts";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    user: null as User | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        const { data } = await authService.login(credentials)
        this.token = data.token
        this.user = data.user
        localStorage.setItem('auth_token', this.token)
      } catch (error) {
        console.error('Erreur lors de la connexion :', error)
        throw error
      }
    },

    initialize() {
      const savedToken = localStorage.getItem('auth_token')
      if (savedToken) this.token = savedToken
    },

    /**
     * Déconnecte l'utilisateur
     */
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('auth_token')
    },
  },
})
