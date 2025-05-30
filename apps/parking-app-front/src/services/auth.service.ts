import type {User} from "@/types/user.ts";
import api from '@/services/api'


export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export default {

  login(credentials: LoginCredentials) {
    return api.post<AuthResponse>('/auth/login', credentials)
  },

  logout() {
    return api.post('/auth/logout')
  },
}
