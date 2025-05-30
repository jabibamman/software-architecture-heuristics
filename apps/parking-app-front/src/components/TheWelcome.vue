<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <div class="min-h-screen py-12 px-6 bg-gradient-to-br from-slate-50 via-white to-slate-100">
    <div class="max-w-5xl mx-auto text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-4">
        🎉 Bienvenue sur votre projet Vue 3
      </h1>
      <p class="text-lg text-gray-600">
        Voici quelques liens utiles pour bien démarrer et explorer l'écosystème Vue.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <WelcomeItem>
        <template #icon><DocumentationIcon /></template>
        <template #heading>Documentation</template>
        Vue’s
        <a
          href="https://vuejs.org/"
          target="_blank"
          rel="noopener"
          class="text-indigo-600 underline hover:text-indigo-800 transition"
        >
          official documentation
        </a>
        provides all the information you need to get started.
      </WelcomeItem>

      <WelcomeItem>
        <template #icon><ToolingIcon /></template>
        <template #heading>Tooling</template>
        Bundled with
        <a href="https://vitejs.dev" class="text-green-600 underline hover:text-green-800">Vite</a>,
        recommended IDE:
        <a
          href="https://code.visualstudio.com/"
          class="text-green-600 underline hover:text-green-800"
          >VSCode</a
        >
        +
        <a
          href="https://github.com/vuejs/language-tools"
          class="text-green-600 underline hover:text-green-800"
          >Vue Tools</a
        >. Test with
        <a href="https://vitest.dev/" class="text-green-600 underline hover:text-green-800"
          >Vitest</a
        >,
        <a href="https://www.cypress.io/" class="text-green-600 underline hover:text-green-800"
          >Cypress</a
        >
        or
        <a href="https://playwright.dev/" class="text-green-600 underline hover:text-green-800"
          >Playwright</a
        >.
        <br />
        <a
          href="javascript:void(0)"
          @click="openReadmeInEditor"
          class="text-sm text-gray-500 underline hover:text-gray-700 mt-2 inline-block"
        >
          Voir le README.md
        </a>
      </WelcomeItem>

      <WelcomeItem>
        <template #icon><EcosystemIcon /></template>
        <template #heading>Ecosystem</template>
        Explorez :
        <a href="https://pinia.vuejs.org/" class="text-orange-600 underline hover:text-orange-800"
          >Pinia</a
        >,
        <a href="https://router.vuejs.org/" class="text-orange-600 underline hover:text-orange-800"
          >Vue Router</a
        >,
        <a
          href="https://test-utils.vuejs.org/"
          class="text-orange-600 underline hover:text-orange-800"
          >Vue Test Utils</a
        >,
        <a
          href="https://github.com/vuejs/devtools"
          class="text-orange-600 underline hover:text-orange-800"
          >Devtools</a
        >. Visitez
        <a
          href="https://github.com/vuejs/awesome-vue"
          class="text-orange-600 underline hover:text-orange-800"
          >Awesome Vue</a
        >
        pour plus de ressources.
      </WelcomeItem>

      <WelcomeItem>
        <template #icon><CommunityIcon /></template>
        <template #heading>Communauté</template>
        Posez vos questions sur
        <a href="https://chat.vuejs.org" class="text-pink-600 underline hover:text-pink-800"
          >Vue Land</a
        >,
        <a
          href="https://stackoverflow.com/questions/tagged/vue.js"
          class="text-pink-600 underline hover:text-pink-800"
          >StackOverflow</a
        >. Suivez
        <a href="https://x.com/vuejs" class="text-pink-600 underline hover:text-pink-800">@vuejs</a>
        pour rester à jour.
      </WelcomeItem>

      <WelcomeItem>
        <template #icon><SupportIcon /></template>
        <template #heading>Soutenir Vue</template>
        Aidez Vue à rester indépendant en
        <a href="https://vuejs.org/sponsor/" class="text-yellow-600 underline hover:text-yellow-800"
          >devenant sponsor</a
        >.
        <br />
        Merci pour votre soutien 🙏
      </WelcomeItem>
    </div>
  </div>
</template>
