<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6" flat>
          <v-tabs
          v-model="tab"
          color="primary"
          align-tabs="center"
          
        >
          <v-tab prepend-icon="mdi-calculator" text="Результаты расчетов" value="option-1"></v-tab>
          <v-tab prepend-icon="mdi mdi-currency-usd" text="Экономические результаты" value="option-2"></v-tab>
        </v-tabs>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="option-1">
              <v-card-actions class="actions-container">
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
              </v-card-actions>
              <v-divider></v-divider>
              <v-card-text>
                <v-row>
                  <v-col v-if="isCalculating" cols="12" class="text-center">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                      :size="50"
                    ></v-progress-circular>
                  </v-col>
                  <v-col
                    v-else
                    v-for="(_, index) in pumpResults.consumptionStation"
                    :key="index"
                    cols="12"
                  >
                    <v-expansion-panels>
                      <v-expansion-panel class="mb-2 rounded-lg" elevation="1">
                        <v-expansion-panel-title>
                          <div class="d-flex align-center">
                            <v-icon
                              icon="mdi-pump"
                              color="primary"
                              class="mr-3"
                            ></v-icon>
                            <div>
                              <div class="text-subtitle-1">
                                {{ pumpStations[index].station }}
                              </div>
                              <div class="text-caption text-medium-emphasis">
                                Расход:
                                {{
                                  formatNumber(
                                    pumpResults.consumptionStation[index]
                                  )
                                }}
                                м³/ч
                              </div>
                            </div>
                          </div>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                          <v-row>
                            <v-col cols="12">
                              <div class="parameters-grid">
                                <div class="parameter-item">
                                  <v-icon
                                    icon="mdi-arrow-up-bold"
                                    color="primary"
                                    size="small"
                                    class="parameter-icon"
                                  ></v-icon>
                                  <span class="parameter-name"
                                    >Напор насоса</span
                                  >
                                  <span class="parameter-value"
                                    >{{
                                      formatNumber(pumpResults.dh_pump[index])
                                    }}
                                    м</span
                                  >
                                </div>

                                <div class="parameter-item">
                                  <v-icon
                                    icon="mdi-arrow-left-bold"
                                    color="primary"
                                    size="small"
                                    class="parameter-icon"
                                  ></v-icon>
                                  <span class="parameter-name"
                                    >Входной напор</span
                                  >
                                  <span class="parameter-value"
                                    >{{
                                      formatNumber(pumpResults.h_in[index])
                                    }}
                                    м</span
                                  >
                                </div>

                                <div class="parameter-item">
                                  <v-icon
                                    icon="mdi-arrow-right-bold"
                                    color="primary"
                                    size="small"
                                    class="parameter-icon"
                                  ></v-icon>
                                  <span class="parameter-name"
                                    >Выходной напор</span
                                  >
                                  <span class="parameter-value"
                                    >{{
                                      formatNumber(pumpResults.h_out[index])
                                    }}
                                    м</span
                                  >
                                </div>

                                <div class="parameter-item">
                                  <v-icon
                                    icon="mdi-arrow-down-bold"
                                    color="primary"
                                    size="small"
                                    class="parameter-icon"
                                  ></v-icon>
                                  <span class="parameter-name"
                                    >Потери напора</span
                                  >
                                  <span class="parameter-value"
                                    >{{
                                      formatNumber(pumpResults.head_loss[index])
                                    }}
                                    м</span
                                  >
                                </div>

                                <div class="parameter-item">
                                  <v-icon
                                    icon="mdi-speedometer"
                                    color="primary"
                                    size="small"
                                    class="parameter-icon"
                                  ></v-icon>
                                  <span class="parameter-name"
                                    >Скорость потока</span
                                  >
                                  <span class="parameter-value"
                                    >{{
                                      formatNumber(pumpResults.speed[index])
                                    }}
                                    м/с</span
                                  >
                                </div>

                                <div class="parameter-item">
                                  <v-icon
                                    icon="mdi-chart-bubble"
                                    color="primary"
                                    size="small"
                                    class="parameter-icon"
                                  ></v-icon>
                                  <span class="parameter-name"
                                    >Число Рейнольдса</span
                                  >
                                  <span class="parameter-value">{{
                                    formatNumber(pumpResults.Re[index])
                                  }}</span>
                                </div>
                                <div class="parameter-item">
                                  <v-icon
                                    icon="mdi-lightning-bolt"
                                    color="primary"
                                    size="small"
                                    class="parameter-icon"
                                  ></v-icon>
                                  <span class="parameter-name">Мощность</span>
                                  <span class="parameter-value"
                                    >{{
                                      formatNumber(
                                        Math.round(
                                          pumpResults?.pumpPerformanceResults[
                                            index
                                          ]?.totalPower,
                                          2
                                        )
                                      ) / 1000
                                    }}
                                    кВт</span
                                  >
                                </div>
                              </div>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-tabs-window-item>
            <v-tabs-window-item value="option-2">
              <EconomTable />
            </v-tabs-window-item>  
          </v-tabs-window>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { computed, watch, ref } from "vue";
import { useIndexStore } from "../../stores/index";
import { useOptionsStore } from "../../stores/options";
import { useCalculationsStore } from "../../stores/calculations";
import { utils as XLSXUtils, writeFile } from "xlsx";
import EconomTable from "./EconomTable.vue"

export default {
  name: "BaseCanculationInfoGet",
  components:{
    EconomTable
  },
  setup() {
    const indexStore = useIndexStore();
    const optionsStore = useOptionsStore();
    const calculationsStore = useCalculationsStore();
    const pumpStations = computed(() => indexStore.getStations);
    const pumpResults = computed(() => calculationsStore.getPumpResults);
    console.log(pumpResults.value.pumpPerformanceResults);
    const isExporting = ref(false);
    const chartDialog = ref(false);
    const activeTab = ref(0);

    const financialHeaders = ref([
      { title: "Станция", key: "station", align: "start", sortable: false },
      { title: "Стоимость (руб)", key: "cost", align: "end" },
    ]);

    const financialData = computed(() => {
      return pumpStations.value.map((station, index) => ({
        id: index + 1,
        station: station.station,
        cost: pumpResults.value.costs ? pumpResults.value.costs[index] : 0,
      }));
    });

    const formatNumber = (value) => {
      if (typeof value !== "number") return "-";
      return value.toFixed(2);
    };

    const formatCurrency = (value) => {
      if (typeof value !== "number") return "-";
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 2,
      }).format(value);
    };

    const exportFinancialData = () => {
      const wb = XLSXUtils.book_new();
      const data = financialData.value.map((item) => ({
        Станция: item.station,
        "Стоимость (руб)": item.cost,
      }));

      const ws = XLSXUtils.json_to_sheet(data);
      XLSXUtils.book_append_sheet(wb, ws, "Финансовые данные");
      writeFile(wb, "financial-data.xlsx");
    };

    const exportFormats = [
      { title: "Экспорт в Excel", format: "excel", icon: "mdi-file-excel" },
    ];

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

    const exportToExcel = () => {
      const results = pumpResults.value;
      const wb = XLSXUtils.book_new();

      const data = results.consumptionStation.map((consumption, index) => ({
        Станция: index + 1,
        "Расход (м³/ч)": formatNumber(consumption),
        "Напор насоса (м)": formatNumber(results.dh_pump[index]),
        "Входной напор (м)": formatNumber(results.h_in[index]),
        "Выходной напор (м)": formatNumber(results.h_out[index]),
        "Потери напора (м)": formatNumber(results.head_loss[index]),
        "Скорость потока (м/с)": formatNumber(results.speed[index]),
        "Число Рейнольдса": formatNumber(results.Re[index]),
      }));

      const ws = XLSXUtils.json_to_sheet(data);
      XLSXUtils.book_append_sheet(wb, ws, "Расчеты");
      writeFile(wb, "pump-calculations.xlsx");
    };

    const refreshData = () => {
      calculationsStore.updateCalculations();
    };

    const showChart = () => {
      chartDialog.value = true;
    };

    watch(
      [
        () => indexStore.getStations,
        () => optionsStore.selectOptions.centrifugal_pumps,
      ],
      () => {
        calculationsStore.updateCalculations();
      },
      { deep: true }
    );

    calculationsStore.updateCalculations();
      const  tab = ref(0);
    return {
      pumpResults,
      pumpStations,
      formatNumber,
      formatCurrency,
      isCalculating: computed(() => calculationsStore.getIsCalculating),
      exportFormats,
      exportData,
      isExporting,
      chartDialog,
      refreshData,
      showChart,
      activeTab,
      financialHeaders,
      financialData,
      exportFinancialData,
      tab
    };
  },
};
</script>

<style scoped>
.v-card--variant-elevated {
  box-shadow: none;
}
.v-card-actions {
  padding: 1rem !important;
}
.v-expansion-panel-title {
  padding: 12px 20px !important;
}

.v-expansion-panel-text__wrapper {
  padding: 0 20px 20px !important;
}

.parameters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.parameter-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  min-width: 0;
}

.parameter-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.parameter-name {
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.parameter-value {
  color: rgb(var(--v-theme-primary));
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .parameters-grid {
    grid-template-columns: 1fr;
  }

  .parameter-item {
    padding: 6px;
    gap: 6px;
  }
}

.actions-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.export-button {
  min-width: 160px;
}

.actions-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--v-theme-surface-variant));
  border-radius: 8px;
  margin-top: 16px;
}

@media (max-width: 600px) {
  .actions-container {
    flex-direction: column;
    align-items: stretch;
  }

  .actions-right {
    justify-content: flex-end;
  }

  .export-button {
    width: 100%;
  }
}
</style>
