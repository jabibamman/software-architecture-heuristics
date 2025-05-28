import api from '@/services/api'

export const getHealth = async () => {
  return await api.get('/health')
}
