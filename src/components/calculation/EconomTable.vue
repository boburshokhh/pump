<template>
      <v-card-text class="pa-4">
        <!-- Кнопка экспорта -->
        <v-btn
          color="primary"
          variant="tonal"
          prepend-icon="mdi-file-excel"
          @click="exportData('excel')"
          :loading="isExporting"
          class="export-button"
        >
          Экспорт в Excel
          <v-tooltip activator="parent" location="top">
            Экспортировать результаты в Excel
          </v-tooltip>
        </v-btn>
  
        <!-- Таблица данных -->
        <v-data-table
          :headers="headers"
          :items="transportationCosts"
          :items-per-page="10"
          :striped="true"
          :mobile-breakpoint="600"
          class="elevation-2 rounded-lg mt-4"
          hover
        >
          <!-- Форматирование числовых значений -->
          <template #item.electricity="{ item }">
            <span class="font-weight-medium">
              {{ formatNumber(item.electricity) }} у.е/сут
            </span>
          </template>
  
          <template #item.afp="{ item }">
            <span class="font-weight-medium">
              {{ formatNumber(item.afp) }} у.е/сут
            </span>
          </template>
  
          <template #item.totalDaily="{ item }">
            <span class="text-success font-weight-bold">
              {{ formatNumber(item.totalDaily) }} у.е/сут
            </span>
          </template>
  
          <template #item.totalMonthly="{ item }">
            <span class="text-error font-weight-bold">
              {{ formatNumber(item.totalMonthly) }} у.е/мес
            </span>
          </template>
        </v-data-table>
        </v-card-text>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { utils as XLSXUtils, writeFile } from "xlsx";
  
  const headers = ref([
    { title: 'Станция', key: 'station', align: 'start', width: '20%' },
    { title: 'Эл/энергия (у.е/сут)', key: 'electricity', align: 'center', width: '20%' },
    { title: 'АФП (у.е/сут)', key: 'afp', align: 'center', width: '20%' },
    { title: 'Итого (у.е/сут)', key: 'totalDaily', align: 'center', width: '20%' },
    { title: 'Итого (у.е/мес)', key: 'totalMonthly', align: 'end', width: '20%' },
  ]);
  
  // Исходные данные
  const transportationCosts = ref([
    { station: 'Центральный вокзал', electricity: 12500, afp: 8700 },
    { station: 'Северный терминал', electricity: 15400, afp: 9200 },
    { station: 'Южный хаб', electricity: 9800, afp: 6500 },
    { station: 'Восточная платформа', electricity: 13200, afp: 11400 },
    { station: 'Западный грузовой узел', electricity: 16700, afp: 13500 },
  ]);
  
  // Вычисляем производные поля
  transportationCosts.value = transportationCosts.value.map(item => ({
    ...item,
    totalDaily: item.electricity + item.afp,
    totalMonthly: (item.electricity + item.afp) * 30,
  }));
  
  // Флаг загрузки экспорта
  const isExporting = ref(false);
  
  // Форматирование чисел
  const formatNumber = (value) => {
    return new Intl.NumberFormat('ru-RU').format(value);
  };
  
  // Функция экспорта данных в Excel
  const exportToExcel = async () => {
    // Преобразуем данные в удобный для экспорта формат
    const worksheetData = transportationCosts.value.map(item => ({
      'Станция': item.station,
      'Эл/энергия (у.е/сут)': item.electricity,
      'АФП (у.е/сут)': item.afp,
      'Итого (у.е/сут)': item.totalDaily,
      'Итого (у.е/мес)': item.totalMonthly,
    }));
  
    // Создаём рабочий лист и книгу
    const worksheet = XLSXUtils.json_to_sheet(worksheetData);
    const workbook = { Sheets: { 'Данные': worksheet }, SheetNames: ['Данные'] };
  
    // Сохраняем книгу в файл Excel
    writeFile(workbook, "transportation_costs.xlsx");
  };
  
  // Функция-обёртка для экспорта, переключающая флаг загрузки
  const exportData = async (format) => {
    if (format === "excel") {
      isExporting.value = true;
      try {
        await exportToExcel();
      } finally {
        isExporting.value = false;
      }
    }
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
  
  .export-button {
    margin-bottom: 16px;
  }
  </style>
  