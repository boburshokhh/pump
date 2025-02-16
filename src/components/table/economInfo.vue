<template>
  <v-card class="mx-auto elevation-5" max-width="95%">
    <v-card-title class="text-h5 pa-4 bg-primary">
      Затраты на транспортировку
    </v-card-title>

    <v-card-text class="pa-4">
      <v-data-table
        :headers="headers"
        :items="transportationCosts"
        :items-per-page="10"
        :striped="true"
        :mobile-breakpoint="600"
        class="elevation-2 rounded-lg"
        hover
      >
        <!-- Форматирование числовых значений -->
        <template #item.electricity="{ item }">
          <span class="font-weight-medium">
            {{ formatNumber(item.columns.electricity) }} у.е/сут
          </span>
        </template>

        <template #item.afp="{ item }">
          <span class="font-weight-medium">
            {{ formatNumber(item.columns.afp) }} у.е/сут
          </span>
        </template>

        <template #item.totalDaily="{ item }">
          <span class="text-success font-weight-bold">
            {{ formatNumber(item.columns.totalDaily) }} у.е/сут
          </span>
        </template>

        <template #item.totalMonthly="{ item }">
          <span class="text-error font-weight-bold">
            {{ formatNumber(item.columns.totalMonthly) }} у.е/мес
          </span>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from "vue";

const headers = ref([
  { title: "Станция", key: "station", align: "start", width: "20%" },
  {
    title: "Эл/энергия (у.е/сут)",
    key: "electricity",
    align: "center",
    width: "20%",
  },
  { title: "АФП (у.е/сут)", key: "afp", align: "center", width: "20%" },
  {
    title: "Итого (у.е/сут)",
    key: "totalDaily",
    align: "center",
    width: "20%",
  },
  { title: "Итого (у.е/мес)", key: "totalMonthly", align: "end", width: "20%" },
]);

const transportationCosts = ref([
  { station: "Центральный вокзал", electricity: 12500, afp: 8700 },
  { station: "Северный терминал", electricity: 15400, afp: 9200 },
  { station: "Южный хаб", electricity: 9800, afp: 6500 },
  { station: "Восточная платформа", electricity: 13200, afp: 11400 },
  { station: "Западный грузовой узел", electricity: 16700, afp: 13500 },
]);

// Вычисляем производные поля
transportationCosts.value = transportationCosts.value.map((item) => ({
  ...item,
  totalDaily: item.electricity + item.afp,
  totalMonthly: (item.electricity + item.afp) * 30,
}));

const formatNumber = (value) => {
  return new Intl.NumberFormat("ru-RU").format(value);
};
</script>

<style scoped>
:deep(.v-data-table__th) {
  background-color: #f5f5f5;
  font-weight: 700 !important;
}

:deep(.v-data-table__td) {
  transition: background-color 0.3s ease;
}

:deep(.v-data-table__tr:hover .v-data-table__td) {
  background-color: #f8f9fa !important;
}

.text-success {
  color: #2e7d32;
}

.text-error {
  color: #d32f2f;
}

.bg-primary {
  background-color: #1976d2;
  color: white;
}
</style>
