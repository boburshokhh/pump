import { defineStore } from 'pinia'

export const useCalculationsStore = defineStore('calculations', {
  state: () => ({
    // Результаты расчетов
    results: {
      head_loss: [],        // Потери напора
      h_in: [],            // Напор на входе
      h_out: [],           // Напор на выходе
      speed: [],           // Скорость потока
      reynolds: [],        // Числа Рейнольдса
      resistance: [],      // Коэффициенты сопротивления
      consumption: [],     // Расходы
      internal_diameter: [],// Внутренние диаметры
      pump_head: []        // Напоры насосов
    },
    
    // Параметры для построения графика
    chartData: {
      distances: [],       // Расстояния по трассе
      pressurePoints: []   // Точки для построения линии гидравлического уклона
    },
    
    // Общие характеристики системы
    systemParameters: {
      totalHeadLoss: 0,    // Суммарные потери напора
      totalSystemHead: 0,  // Общий напор системы
      totalLength: 0       // Общая длина трассы
    }
  }),

  getters: {
    // Геттеры для получения данных
    getHeadLoss: (state) => state.results.head_loss,
    getInputHead: (state) => state.results.h_in,
    getOutputHead: (state) => state.results.h_out,
    getChartData: (state) => state.chartData,
    getSystemParameters: (state) => state.systemParameters,
    
    // Геттер для получения данных конкретной станции
    getStationData: (state) => (stationIndex) => ({
      headLoss: state.results.head_loss[stationIndex],
      inputHead: state.results.h_in[stationIndex],
      outputHead: state.results.h_out[stationIndex],
      speed: state.results.speed[stationIndex],
      reynolds: state.results.reynolds[stationIndex],
      resistance: state.results.resistance[stationIndex],
      consumption: state.results.consumption[stationIndex],
      pumpHead: state.results.pump_head[stationIndex]
    })
  },

  actions: {
    // Действие для сохранения результатов расчета
    setCalculationResults(results) {
      this.results = {
        head_loss: results.head_loss,
        h_in: results.h_in,
        h_out: results.h_out,
        speed: results.speed,
        reynolds: results.Re,
        resistance: results.lam,
        consumption: results.consumptionStation,
        internal_diameter: results.d_internal,
        pump_head: results.dh_pump
      }
    },

    // Действие для сохранения данных графика
    setChartData(chartData) {
      this.chartData = chartData
    },

    // Действие для сохранения общих параметров системы
    setSystemParameters(params) {
      this.systemParameters = params
    },

    // Очистка всех данных
    clearAll() {
      this.$reset()
    }
  }
}) 