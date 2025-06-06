import type { User } from '@/types/user.ts'
import api from '@/services/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export default {
  login(creds: LoginCredentials) {
    return api.post<AuthResponse>('/auth/login', creds)
  },

  register(payload: { name: string; email: string; password: string }) {
    return api.post<AuthResponse>('/auth/register', payload)
  },

  logout() {
    return api.post('/auth/logout')
  },
}
