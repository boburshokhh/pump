import { defineStore } from "pinia";

export const useIndexStore = defineStore("stationStore", {
  state: () => ({
    stations: [
      {
        station: "Станция 1",
        flow: 2500,
        pumps: [
          { id: 1, name: "HM 1250-260", numOfPumps: 2, fact_rpm: 2900 },
          { id: 2, name: "HM 3600-230", numOfPumps: 2, fact_rpm: 2850 }, // Используем фактическую скорость вращения
        ],
        inputPressure: "1000", // Подставьте значение из расчета h_in[0]
        outputPressure: "1100", // Подставьте значение из расчета h_out[0]
        length: 100,
        power: "50", // Мощность можно рассчитать, если нужно
        afpType: "Тип 1",
        afp_consumption: 10,
        liquidParameters: {
          density: 850,
          viscosity: 10,
        },
        pipeParameters: {
          diameter: 720, // Умножаем на 1000, чтобы перевести в мм
          wallThickness: 10, // Умножаем на 1000, чтобы перевести в мм
          roughness: 0.1, // Умножаем на 1000, чтобы перевести в мм
          pressure: 10, // Давление
        },
      },
      {
        station: "Станция 2",
        flow: 3500,
        pumps: [
          { id: 2, name: "HM 3600-230", numOfPumps: 1, fact_rpm: 2850 },
          { id: 6, name: "HM 3600-230 (подача 2500 м³/ч)", numOfPumps: 1, fact_rpm: 2850 },
        ],
        inputPressure: "1100", // Подставьте значение из h_in[1]
        outputPressure: "1200", // Подставьте значение из h_out[1]
        length: 90,
        power: "70",
        afpType: "Тип 2",
        afp_consumption: 15,
        liquidParameters: {
          density: 850,
          viscosity: 10,
        },
        pipeParameters: {
          diameter: 820,
          wallThickness: 10,
          roughness: 0.1,
          pressure: 11,
        },
      },
      {
        station: "Станция 3",
        flow: 3500,
        pumps: [
          { id: 3, name: "HM 5000-210", numOfPumps: 2, fact_rpm: 3000 },
        ],
        inputPressure: "1200", // Подставьте значение из h_in[2]
        outputPressure: "1300", // Подставьте значение из h_out[2]
        length: 110,
        power: "90",
        afpType: "Тип 3",
        afp_consumption: 3,
        liquidParameters: {
          density: 850,
          viscosity: 10,
        },
        pipeParameters: {
          diameter: 820,
          wallThickness: 10,
          roughness: 0.1,
          pressure: 11,
        },
      },
      {
        station: "Станция 4",
        flow: 3100,
        pumps: [
          { id: 3, name: "HM 2500-230 (подача 1800 м³/ч)", numOfPumps: 2, fact_rpm: 2800 },
        ],
        inputPressure: "1300", // Подставьте значение из h_in[3]
        outputPressure: "1400", // Подставьте значение из h_out[3]
        length: 110,
        power: "100",
        afpType: "Тип 4",
        afp_consumption: 8,
        liquidParameters: {
          density: 850,
          viscosity: 10,
        },
        pipeParameters: {
          diameter: 820,
          wallThickness: 10,
          roughness: 0.1,
          pressure: 12,
        },
      },
      {
        station: "Станция 5",
        flow: 3100,
        pumps: [
          { id: 3, name: "HM 2500-230 (подача 1800 м³/ч)", numOfPumps: 2, fact_rpm: 2800 },
        ],
        inputPressure: "1300", // Подставьте значение из h_in[3]
        outputPressure: "1400", // Подставьте значение из h_out[3]
        length: 110,
        power: "100",
        afpType: "Тип 4",
        afp_consumption: 8,
        liquidParameters: {
          density: 850,
          viscosity: 10,
        },
        pipeParameters: {
          diameter: 820,
          wallThickness: 10,
          roughness: 0.1,
          pressure: 12,
        },
      },
    ],
  }),
  getters: {
    getStations: (state) => state.stations,
  },
  actions: {
    addStation(station) {
      this.stations.push(station);
    },
    updateStation(index, updatedStation) {
      this.stations[index] = updatedStation;
    },
    deleteStation(index) {
      if (index >= 0 && index < this.stations.length) {
        this.stations.splice(index, 1);
      } else {
        console.error("Индекс вне диапазона. Удаление невозможно.");
      }
    },
  },
});
