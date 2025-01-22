<template>
  <div class="table">
    <dialogPump />
    <BaseEditForm v-model:dialog="isDialogOpen" :pumpStationIndex="pumpStationIndex" :station="pumpStation" />
    <!-- <SelectComponents /> -->
    <!-- <v-card class="mx-auto"> -->
      <v-divider></v-divider>
      <v-card-text>
        <div class="table-header">
          <div class="table-title">
            <h2>Список станций</h2>
            <span class="station-count">Всего станций: {{ stations.length }}</span>
          </div>
          <div class="table-actions">
            <div class="search-wrapper">
              <v-text-field
                v-model="searchQuery"
                class="search-field"
                placeholder="Поиск по станциям и насосам..."
                clearable
                density="compact"
                @click:clear="clearSearch"
              >
                <template v-slot:prepend-inner>
                  <v-icon
                    :color="searchQuery ? 'white' : 'grey-lighten-2'"
                    class="search-icon"
                  >
                    mdi-magnify
                  </v-icon>
                </template>
              </v-text-field>
              <div v-if="searchQuery && filteredStations.length > 0" class="search-results">
                Найдено: {{ filteredStations.length }} {{ getNounForm(filteredStations.length, ['станция', 'станции', 'станций']) }}
              </div>
            </div>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  color="success"
                  v-bind="props"
                  class="export-btn"
                  elevation="2"
                >
                  <v-icon icon="mdi-microsoft-excel" class="export-icon"></v-icon>
                  <span class="export-text">Excel</span>
                </v-btn>
              </template>
              <v-list class="export-menu">
                <v-list-item
                  @click="downloadExcel('all')"
                  class="export-menu-item"
                >
                  <v-list-item-title>
                    <v-icon start icon="mdi-table-multiple" class="mr-2"></v-icon>
                    Скачать все станции
                  </v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item
                  v-for="(station, index) in stations"
                  :key="index"
                  @click="downloadExcel('single', index)"
                  class="export-menu-item"
                >
                  <v-list-item-title>
                    <v-icon start icon="mdi-table" class="mr-2"></v-icon>
                    {{ station.station }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
        <v-table
          fixed-header
          height="500px"
          class="elevation-1 custom-table"
          :loading="isLoading"
        >
          <thead>
            <tr>
              <th v-for="(header, index) in headers" 
                  :key="index" 
                  class="text-left table-header-cell"
                  :class="{ 
                    'actions-column': header.isAction,
                    'station-column': header.isStation 
                  }"
                  :style="{ width: header.width }"
              >
                <div class="header-content">
                  {{ header.text }}
                  <v-icon
                    v-if="header.icon"
                    :icon="header.icon"
                    size="small"
                    class="ml-1"
                    color="grey-darken-1"
                  ></v-icon>
                  <v-tooltip v-if="header.tooltip" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        size="small"
                        class="ml-1"
                        color="grey-darken-1"
                      >
                        mdi-information
                      </v-icon>
                    </template>
                    <span>{{ header.tooltip }}</span>
                  </v-tooltip>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredStations" 
                :key="index"
                :class="{ 'highlighted-row': item.isHighlighted }"
                @click="selectRow(index)"
            >
              <td class="station-column">
                <div class="station-name">{{ item.station }}</div>
              </td>
              <td>{{ item.flow }}</td>
              <td>{{ item.length }}</td>
              <td>{{ item.afp_consumption }}</td>
              <td class="pumps-column">
                <div v-for="pump in item.pumps" 
                     :key="pump.id" 
                     class="pump-info"
                >
                  <span
                    @click="showPumpMoreInfo(pump)"
                    class="pump-link"
                  >
                    {{ pump.name }}
                  </span>
                </div>
              </td>
              <td class="pumps-column">
                <div v-for="pump in item.pumps" 
                     :key="pump.id" 
                     class="pump-info"
                >
                  {{ pump.numOfPumps }}
                </div>
              </td>
              <td class="pumps-column">
                <div v-for="pump in item.pumps" 
                     :key="pump.id" 
                     class="pump-info"
                >
                  {{ pump.rpm }}
                </div>
              </td>
              <td>{{ item.inputPressure }}</td>
              <td>{{ item.outputPressure }}</td>
              <td>{{ item.power }}</td>
              <td>
                <PipeAndLiquidParameters :parameters="item" />
              </td>
              <td class="actions-column">
                <div class="action-buttons">
                  <v-btn
                    size="small"
                    color="primary"
                    variant="text"
                    class="action-btn"
                    @click.stop="openDialog(index, item)"
                  >
                    <v-icon size="small">mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="top">
                      <span>Редактировать НПС</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn
                    size="small"
                    color="error"
                    variant="text"
                    class="action-btn"
                    @click.stop="deleteStation(index)"
                  >
                    <v-icon size="small">mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="top">
                      <span>Удалить НПС</span>
                    </v-tooltip>
                  </v-btn>
                </div>
              </td>
            </tr>
            <!-- Пустое состояние -->
            <tr v-if="filteredStations.length === 0">
              <td :colspan="headers.length" class="text-center empty-state">
                <v-icon size="large" color="grey-lighten-1">mdi-alert-circle-outline</v-icon>
                <p>{{ searchQuery ? 'Станции не найдены' : 'Нет доступных станций' }}</p>
              </td>
            </tr>
          </tbody>
        </v-table>

        <!-- Пагинация -->
        <div class="table-footer">
          <div class="items-per-page">
            <span>Строк на странице:</span>
            <v-select
              v-model="itemsPerPage"
              :items="[5, 10, 15, 20, 25, 50]"
              density="compact"
              hide-details
              class="items-select"
            ></v-select>
          </div>
          <v-pagination
            v-model="currentPage"
            :length="pageCount"
            :total-visible="7"
          ></v-pagination>
        </div>
      </v-card-text>
    <!-- </v-card> -->
    <!-- <PipeAndLiquidParameters :parameters="selectedPipe" @close="showModalPipeAndLiquid = false"></PipeAndLiquidParameters> -->
    <pumpInfo 
      ref="pumpModal"
      v-if="showModalPump"
      @close="showModalPump = false"
      :parameters="selectedPumpId"
    />
  </div>
</template>

<script>
import dialogPump from "../modals/PumpDialog.vue";
import { useIndexStore } from "../../stores/index";
import { useNotification } from "naive-ui";
import BaseEditForm from "./BaseEditForm.vue";
import PipeAndLiquidParameters from "../table/PipeAndLiquidParameters.vue";
import pumpInfo from "../modals/pumpInfo.vue"
import * as XLSX from 'xlsx';

export default {
  components: {
    dialogPump,
    useNotification,
    BaseEditForm,
    PipeAndLiquidParameters,
    pumpInfo
  },
  computed: {
    stations() {
      return this.stationStore.getStations;
    },
    filteredStations() {
      let filtered = this.stations;
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(station => 
          station.station.toLowerCase().includes(query) ||
          station.pumps.some(pump => pump.name.toLowerCase().includes(query))
        );
      }
      
      // Пагинация
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return filtered.slice(start, end);
    },
    pageCount() {
      return Math.ceil(this.filteredStations.length / this.itemsPerPage);
    }
  },
  data() {
    return {
      stationStore: useIndexStore(),
      showNotification: false,
      notificationText: "",
      notificationColor: "red",
      notificationComponent: null,
      isDialogOpen: false,
      pumpStation: {},
      pumpStationIndex: 0,
      showModalPipeAndLiquid: false,
      selectedPipe: {},
      selectedPumpId: null,
      showModalPump:false,
      headers: [
        { text: 'Станция', width: '8%', isStation: true, icon: 'mdi-office-building' },
        { text: 'Расход', width: '7%', tooltip: 'Расход в м³/ч', icon: 'mdi-pump' },
        { text: 'Длина участка', width: '8%', tooltip: 'Длина участка в км', icon: 'mdi-ruler' },
        { text: 'Расход АФП', width: '7%', tooltip: 'Расход АФП в км', icon: 'mdi-chart-line' },
        { text: 'Насосы', width: '15%', icon: 'mdi-pump-off' },
        { text: 'Кол-во насосов', width: '7%', icon: 'mdi-counter' },
        { text: 'Обороты', width: '7%', tooltip: 'Число оборотов', icon: 'mdi-rotate-right' },
        { text: 'Давление вход', width: '8%', tooltip: 'Давление на входе МНС, кПа', icon: 'mdi-gauge-low' },
        { text: 'Давление выход', width: '8%', tooltip: 'Давление на выходе НПС, кПа', icon: 'mdi-gauge' },
        { text: 'Мощность', width: '7%', tooltip: 'Затрачиваемая мощность, кВт', icon: 'mdi-lightning-bolt' },
        { text: 'Параметры', width: '8%', tooltip: 'Параметры жидкости и трубы', icon: 'mdi-tune-vertical' },
        { text: 'Действия', width: '10%', isAction: true, icon: 'mdi-cog' }
      ],
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      isLoading: false,
      selectedRow: null,
      isSearching: false,
      searchTimeout: null,
    };
  },
  watch: {
    searchQuery(newVal) {
      // Добавляем небольшую задержку перед поиском
      clearTimeout(this.searchTimeout);
      this.isSearching = true;
      
      this.searchTimeout = setTimeout(() => {
        this.performSearch(newVal);
        this.isSearching = false;
      }, 300);
    }
  },
  methods: {
    openDialog(index, station) {
      event?.stopPropagation();
      
      this.isDialogOpen = true;
      this.pumpStationIndex = index;
      this.pumpStation = { ...station };
    },
    openPipeAndLiquidParameters(item) {
      this.selectedPipe = item;
      this.showModalPipeAndLiquid = true;
    },
    async fetchData() {
      this.isLoading = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        // ... your data fetching logic
      } finally {
        this.isLoading = false;
      }
    },
    validNumOfPumps(value) {
      return value > 0 ? null : "error";
    },
    showPumpMoreInfo(pump) {
        if (!pump || !pump.id) {
            console.error("Неверные данные насоса:", pump);
            return;
        }
        this.showModalPump= true;
        this.selectedPumpId = pump.id;
        setTimeout(()=>{
            this.$refs.pumpModal.open();
        },100)
    },
    downloadExcel(type, stationIndex = null) {
      try {
        let excelData;
        let filename;

        if (type === 'all') {
          excelData = this.stations.map(this.prepareStationData);
          filename = 'all_stations_data.xlsx';
        } else {
          excelData = [this.prepareStationData(this.stations[stationIndex])];
          filename = `station_${this.stations[stationIndex].station}.xlsx`;
        }

        // Создание рабочей книги Excel
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Станции');

        // Автоматическая настройка ширины столбцов
        const maxWidth = 50;
        const wscols = Object.keys(excelData[0]).map(key => ({
          wch: Math.min(key.length + 2, maxWidth)
        }));
        worksheet['!cols'] = wscols;

        // Стилизация заголовков
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_col(C) + "1";
          if (!worksheet[address]) continue;
          worksheet[address].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "EFEFEF" } }
          };
        }

        // Скачивание файла
        XLSX.writeFile(workbook, filename);
      } catch (error) {
        console.error('Ошибка при создании Excel файла:', error);
      }
    },
    prepareStationData(item) {
          const pumpsInfo = item.pumps.map(pump => 
            `${pump.name} (${pump.numOfPumps}шт, ${pump.rpm}об/мин)`
          ).join(', ');
          
          return {
            'Станция': item.station,
            'Расход, м³/ч': item.flow,
            'Длина участки, км': item.length,
            'Расход АФП, км': item.afp_consumption,
            'Насосы': pumpsInfo,
            'Давление на входе МНС, кПа': item.inputPressure,
            'Давление на выходе НПС, кПа': item.outputPressure,
            'Затрачиваемая мощность, кВт': item.power
          };
    },
    deleteStation(index) {
      // Добавьте подтверждение перед удалением
      if (confirm('Вы уверены, что хотите удалить эту станцию?')) {
        this.stationStore.deleteStation(index);
      }
    },
    selectRow(index) {
      if (event?.target?.closest('.action-buttons')) {
        return;
      }
      this.selectedRow = index;
    },
    clearSearch() {
      this.searchQuery = '';
      this.currentPage = 1;
    },
    performSearch(query) {
      // Здесь можно добавить дополнительную логику поиска
      this.currentPage = 1; // Сбрасываем на первую страницу при поиске
    },
    getNounForm(number, forms) {
      const cases = [2, 0, 1, 1, 1, 2];
      return forms[(number % 100 > 4 && number % 100 < 20) ? 2 : 
        cases[(number % 10 < 5) ? number % 10 : 5]];
    }
  },
};
</script>

<style>
.table {
  margin: 1rem;
}

.v-table {
  background: white !important;
}

.station-link {
  color: var(--v-primary-base);
  cursor: pointer;
  text-decoration: underline;
}

.pump-list {
  background: transparent !important;
  padding: 0 !important;
}

.pump-item {
  min-height: 32px !important;
  padding: 0 !important;
}

.pump-link {
  color: var(--v-primary-base);
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dashed;
}

/* Адаптивные стили */
@media (max-width: 960px) {
  .table {
    margin: 0.5rem;
  }

  .v-table {
    font-size: 14px;
  }
}

@media (max-width: 600px) {
  .v-table {
    font-size: 12px;
  }
}

/* Анимации */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.table-title {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.table-title h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
}

.station-count {
  color: #666;
  font-size: 0.9rem;
}

.search-wrapper {
  position: relative;
  min-width: 300px;
  max-width: 400px;
  height: 40px; /* Высота как у кнопки Excel */
}

.search-field {
  background-color: var(--v-primary-base) !important;
  border-radius: 8px !important;
  transition: all 0.3s ease;
  height: 40px !important;
}

.search-field :deep(.v-field__input) {
  color: white !important;
  min-height: 40px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.search-field :deep(.v-field__outline) {
  border-color: transparent !important;
}

.search-field :deep(.v-field__clearable) {
  color: white !important;
}

.search-field :deep(input::placeholder) {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 0.95rem;
}

.search-field:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--v-primary-base), 0.2);
}

.search-field:focus-within {
  background-color: white !important;
}

.search-field:focus-within :deep(.v-field__input) {
  color: var(--v-primary-base) !important;
}

.search-field:focus-within :deep(input::placeholder) {
  color: #999 !important;
}

.search-field:focus-within .search-icon {
  color: var(--v-primary-base) !important;
}

.search-field:focus-within :deep(.v-field__clearable) {
  color: var(--v-primary-base) !important;
}

.search-results {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -24px;
  font-size: 0.8rem;
  color: #666;
  padding: 0 4px;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.export-btn {
  background-color: #27ae60 !important;
  color: white !important;
  padding: 0.5rem 1.25rem !important;
  transition: all 0.3s ease;
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.export-btn:hover {
  background-color: #219a52 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.2);
}

.export-icon {
  margin-right: 8px;
}

.export-text {
  font-size: 0.95rem;
}

.export-menu {
  border-radius: 8px;
  margin-top: 4px;
  min-width: 220px;
}

.export-menu-item {
  padding: 0.75rem 1rem;
  transition: background-color 0.2s ease;
}

.export-menu-item:hover {
  background-color: rgba(39, 174, 96, 0.1);
}

.export-menu-item .v-list-item-title {
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

.actions-column {
  position: sticky !important;
  right: 0;
  background-color: white !important;
  z-index: 2 !important;
  box-shadow: -4px 0 6px -4px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  z-index: 10;
}

.action-btn {
  min-width: 32px !important;
  width: 32px;
  height: 32px !important;
  padding: 0 !important;
  position: relative;
  z-index: 11;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn:hover .v-icon {
  transform: scale(1.1);
}

.action-btn .v-icon {
  font-size: 18px;
  transition: transform 0.2s ease;
}

.pumps-column {
  padding: 0 !important;
}

.pump-info {
  padding: 6px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.pump-info:last-child {
  border-bottom: none;
}

.pump-link {
  color: var(--v-primary-base);
  cursor: pointer;
  text-decoration: none;
  border-bottom: 1px dashed;
  padding-bottom: 1px;
  transition: all 0.2s ease;
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pump-link:hover {
  color: #1867c0;
  border-bottom-style: solid;
}

/* Обновленные стили для ячеек таблицы */
.v-table tbody td {
  padding: 8px 16px !important;
  font-size: 0.9rem;
  color: #34495e;
  vertical-align: middle;
  height: auto !important;
  min-height: 48px;
}

/* Стили для фиксированной колонки действий */
.v-table {
  position: relative;
}

.v-table thead tr th.actions-column,
.v-table tbody tr td.actions-column {
  background-color: #fff !important;
}

.v-table thead tr th.actions-column {
  background-color: #f5f7fa !important;
}

.station-column {
  position: sticky !important;
  left: 0;
  background-color: white !important;
  z-index: 2 !important;
  box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.1);
}

.station-name {
  font-weight: 500;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Обновляем стили для заголовков */
.header-content {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.header-content .v-icon {
  opacity: 0.7;
}

/* Обновляем стили для фиксированных колонок */
.v-table thead tr th.station-column,
.v-table tbody tr td.station-column {
  background-color: #fff !important;
  z-index: 2;
}

.v-table thead tr th.station-column {
  background-color: #f5f7fa !important;
  z-index: 3;
}

.v-table thead tr th.actions-column {
  z-index: 3;
}

/* Стили для наведения на строку */
.v-table tbody tr:hover td {
  background-color: rgba(0, 0, 0, 0.03) !important;
}

/* Стили для четных строк */
.v-table tbody tr:nth-child(even) td.station-column,
.v-table tbody tr:nth-child(even) td.actions-column {
  background-color: #f8fafc !important;
}

.v-table tbody tr:hover td.station-column,
.v-table tbody tr:hover td.actions-column {
  background-color: rgba(0, 0, 0, 0.03) !important;
}

/* Обновленные стили для скроллбара */
.v-table {
  overflow: auto;
  scrollbar-width: thin;
}

.custom-table {
  position: relative;
  overflow: auto !important;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Обновленные стили для фиксированных колонок */
.station-column,
.actions-column {
  position: sticky !important;
  background-color: white !important;
  z-index: 2 !important;
}

.station-column {
  left: 0;
  box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.1);
}

.actions-column {
  right: 0;
  box-shadow: -4px 0 6px -4px rgba(0, 0, 0, 0.1);
}

/* Стили для заголовков фиксированных колонок */
.v-table thead th.station-column,
.v-table thead th.actions-column {
  position: sticky !important;
  z-index: 3 !important;
  background-color: #f5f7fa !important;
}

/* Стили для строк при наведении */
.v-table tbody tr {
  position: relative;
  transition: background-color 0.2s ease;
}

.v-table tbody tr:hover {
  transform: none;
}

.v-table tbody tr:hover td {
  background-color: rgba(0, 0, 0, 0.03) !important;
  transform: none;
}

/* Обновляем стили для фиксированных колонок при наведении */
.v-table tbody tr:hover td.station-column,
.v-table tbody tr:hover td.actions-column {
  background-color: rgba(0, 0, 0, 0.03) !important;
  position: sticky !important;
  transform: none;
}

/* Стили для четных строк */
.v-table tbody tr:nth-child(even) td {
  background-color: #f8fafc !important;
}

.v-table tbody tr:nth-child(even) td.station-column,
.v-table tbody tr:nth-child(even) td.actions-column {
  background-color: #f8fafc !important;
}

/* Стили для четных строк при наведении */
.v-table tbody tr:nth-child(even):hover td,
.v-table tbody tr:nth-child(even):hover td.station-column,
.v-table tbody tr:nth-child(even):hover td.actions-column {
  background-color: rgba(0, 0, 0, 0.03) !important;
}

/* Обновленные стили для контейнера таблицы */
.custom-table {
  position: relative;
  overflow: auto !important;
}

.v-table {
  position: relative;
  border-collapse: separate !important;
  border-spacing: 0 !important;
}

/* Стили для содержимого ячеек */
.station-name,
.action-buttons {
  position: relative;
  z-index: 1;
}

.highlighted-row {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
}

.empty-state {
  padding: 2rem !important;
  text-align: center;
  color: #666;
}

.empty-state .v-icon {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 0.5rem 0;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.items-select {
  width: 80px;
}

/* Удаляем или изменяем стили для анимации строк */
.v-table tbody tr {
  position: relative;
  transition: background-color 0.2s ease;
}

.v-table tbody tr:hover {
  transform: none;
}

.v-table tbody tr:hover td {
  background-color: rgba(0, 0, 0, 0.03) !important;
  transform: none;
}

/* Обновляем стили для фиксированных колонок при наведении */
.v-table tbody tr:hover td.station-column,
.v-table tbody tr:hover td.actions-column {
  background-color: rgba(0, 0, 0, 0.03) !important;
  position: sticky !important;
  transform: none;
}

/* Удаляем лишние анимации */
.v-table tbody tr {
  transition: background-color 0.2s ease;
}

/* Оставляем анимацию только для кнопок действий */
.action-btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: translateY(0);
}

/* Стили для состояния загрузки */
.v-table.v-table--loading {
  position: relative;
  opacity: 0.7;
}

/* Улучшенные стили для мобильных устройств */
@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrapper {
    width: 100%;
    min-width: 100%;
  }

  .search-field {
    width: 100%;
  }

  .search-results {
    position: relative;
    bottom: -8px;
    margin-top: 4px;
  }

  .table-footer {
    flex-direction: column;
    gap: 1rem;
  }

  .items-per-page {
    width: 100%;
    justify-content: center;
  }
}

/* Обновленные стили для анимации очистки поля */
.v-field__clearable {
  transition: opacity 0.2s ease;
}

.v-field__clearable:hover {
  opacity: 0.8;
}

/* Стили для индикатора загрузки */
.v-progress-circular {
  margin-right: 4px;
}

/* Улучшенные стили для placeholder */
.v-field input::placeholder {
  color: #999;
  font-size: 0.9rem;
}

/* Стили для активного состояния поля */
.v-field--focused {
  border-color: var(--v-primary-base) !important;
}
</style>
