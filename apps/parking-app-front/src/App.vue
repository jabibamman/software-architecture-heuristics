<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/reservations">Reservation</RouterLink>
      </nav>

      <!-- Health-check status -->
      <p class="health-status">
        Statut du back-end : <strong>{{ status }}</strong>
      </p>
    </div>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import { ref, onMounted } from 'vue';

const status = ref<'OK' | 'KO' | 'En attente'>('En attente');

onMounted(async () => {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      status.value = data.status === 'UP' ? 'OK' : 'KO';
    } else {
      status.value = 'KO';
    }
  } catch (e) {
    status.value = 'KO';
    console.error('Health check failed', e);
  }
});
</script>

<style scoped>
/* styles existants */
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.health-status {
  margin-top: 1rem;
  text-align: center;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }

  .health-status {
    margin-left: 1rem;
    margin-top: 0;
    text-align: left;
  }
}
</style>
