<script setup>
import FooterComponent from "./components/footer.vue";
</script>

<template>
  <div id="app">
    <n-layout>
      <n-layout-content>
        <router-view name="chartPump"></router-view>
        <router-view name="naiveTable2"></router-view>
        <router-view />
      </n-layout-content>
      <FooterComponent></FooterComponent>
    </n-layout>
  </div>
</template>

<style scoped>
  
</style>
