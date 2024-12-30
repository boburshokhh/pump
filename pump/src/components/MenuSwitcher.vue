<template>
  <v-app>
    <v-app-bar app>
      <v-tabs v-model="selectedView" @change="handleMenuChange" class="mx-auto">
        <v-tab value="table">Таблица</v-tab>
        <v-tab value="chart">График</v-tab>
        <v-tab value="both">Оба вместе</v-tab>
      </v-tabs>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TableView from "./naiveTable2.vue"; // Исправленный путь
import ChartView from "./chartPump.vue"; // Исправленный путь

export default {
  name: "MenuSwitcher",
  components: {
    TableView,
    ChartView,
  },
  data() {
    return {
      selectedView: "table", // Начальное состояние
    };
  },
  watch: {
    selectedView(newView) {
      // Синхронизация маршрута при изменении вкладки
      const routes = {
        table: "/info",
        chart: "/chart",
        both: "/all",
      };
      this.$router.push(routes[newView]);
    },
  },
  methods: {
    handleMenuChange(value) {
      console.log(`Переключено на: ${value}`);
    },
  },
};
</script>

<style scoped>
.combined-view {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
}

.combined-view > * {
  flex: 1 1 calc(50% - 16px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
