
<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100">

    <main class="container mx-auto px-6 py-20 text-center">
      <h2 class="text-5xl font-extrabold text-gray-800 mb-6">
        Votre parking, sans prise de tête
      </h2>
      <p class="text-lg text-gray-600 mb-8">
        Chaque matin, trouvez votre place réservée en quelques clics.<br />
        Gestion simple, check-in rapide, bornes de recharge intégrées.
      </p>
      <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg shadow">
        <RouterLink to="/login">Commencer gratuitement</RouterLink>
      </button>

      <div class="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <Rocket class="w-10 h-10 text-indigo-600 mb-4 mx-auto" />
          <h3 class="text-xl font-semibold mb-2">Simple et rapide</h3>
          <p class="text-gray-500">
            Réservez en moins de 30 secondes et obtenez votre place immédiate.
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <Calendar class="w-10 h-10 text-green-600 mb-4 mx-auto" />
          <h3 class="text-xl font-semibold mb-2">Contrôle total</h3>
          <p class="text-gray-500">
            Gérez la durée, les créneaux et vos besoins en recharge.
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <Zap class="w-10 h-10 text-yellow-600 mb-4 mx-auto" />
          <h3 class="text-xl font-semibold mb-2">Électrique friendly</h3>
          <p class="text-gray-500">
            Places avec bornes intégrées pour vos véhicules électriques.
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <BarChart2 class="w-10 h-10 text-blue-600 mb-4 mx-auto" />
          <h3 class="text-xl font-semibold mb-2">Statistiques</h3>
          <p class="text-gray-500">
            Tableaux de bord pour suivre l’occupation et le no-show.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Rocket, Calendar, Zap, BarChart2 } from 'lucide-vue-next'
</script>

<style scoped>
.container {
  max-width: 960px;
}
</style>