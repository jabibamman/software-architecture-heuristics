import { defineStore } from 'pinia';

// Définition de l'interface User si nécessaire
interface User {
  id: number;
  name: string;
  email: string;
  // ajoutez d'autres propriétés selon vos besoins
}

export const useAuthStore = defineStore('auth', {
  // État initial du store
  state: () => ({
    user: null as User | null,
  }),

  // Actions pour modifier l'état
  actions: {
    /**
     * Effectue la connexion de l'utilisateur
     * Implémentez ici votre logique d'authentification (API, stockage, etc.)
     */
    async login() {
      try {
        // Exemple de logique de connexion
        // const response = await api.post('/login', credentials);
        // this.user = response.data.user;

        // Pour l'instant, on simule un utilisateur connecté
        this.user = {
          id: 1,
          name: 'Utilisateur Test',
          email: 'test@example.com',
        };
      } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        throw error;
      }
    },

    /**
     * Déconnecte l'utilisateur
     */
    logout() {
      this.user = null;
      // Ajoutez ici toute logique de nettoyage (tokens, localStorage, etc.)
    },
  },
});
