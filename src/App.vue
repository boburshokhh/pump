<script setup>
import FooterComponent from "./components/layouts/Footer.vue";
import Header from './components/layouts/Header.vue'
</script>

<template>
  <div id="app">
    <n-layout>
      <v-app>
      <Header></Header>
      <div class="mt-14 "></div>
      <n-layout-content>
        <n-message-provider>
        <router-view />
      </n-message-provider>
      </n-layout-content>
      <FooterComponent></FooterComponent>
    </v-app>
    </n-layout>
  </div>
</template>

<style scoped>
  
</style>
