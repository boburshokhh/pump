<script setup>
import FooterComponent from "./components/footer.vue";
import Header from './components/header.vue'
</script>

<template>
  <div id="app">
    <n-layout>
      <v-app>
      <Header></Header>
      <div class="mt-14 "></div>
      <n-layout-content>
        <router-view name="chartPump"></router-view>
        <router-view name="naiveTable2"></router-view>
        <router-view />
      </n-layout-content>
      <FooterComponent></FooterComponent>
    </v-app>
    </n-layout>
  </div>
</template>

<style scoped>
  
</style>
