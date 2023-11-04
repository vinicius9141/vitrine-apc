<template>
  <div>
    <AppNavbar /> <!-- Inclua o componente AppNavbar no layout -->
    <router-view /> <!-- Aqui será renderizado o conteúdo das rotas filhas -->
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue'; // Importe o componente AppNavbar

export default {
  components: {
    AppNavbar, // Registre o componente AppNavbar no layout
  },
};
</script>

<style>
/* Estilos do layout, se necessário */
</style>
