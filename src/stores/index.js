import { defineStore } from "pinia";

export const useIndexStore = defineStore("stationStore", {
  state: () => ({
    stations: [
      {
        station: "Станция 1",
        flow: 2500,
        pumps: [
          { id: 1, name: "HM 1250-260", numOfPumps: 2, rpm: 1200 },
          { id: 2, name: "HM 2500-230", numOfPumps: 1, rpm: 1600 },
        ],
        inputPressure: "2345",
        outputPressure: "8442",
        length: 100,
        power: "50",
        afpType: "Тип 1",
        afp_consumption:10,
        liquidParameters: {
          density: 850,
          viscosity: 5.2,
        },
        pipeParameters: {
          diameter: 500,
          wallThickness: 8,
          roughness: 0.01,
          pressure: 10,
        },
      },
      {
        station: "Станция 2",
        flow: 3000,
        pumps: [
          { id: 5, name: "HM 3600-230", numOfPumps: 2, rpm: 1450 },
          { id: 6, name: "HM 3600-230 (подача 2500 м3/ч)", numOfPumps: 1, rpm: 860 },
        ],
        inputPressure: "2545",
        outputPressure: "9442",
        power: "70",
        length: 100,
        afpType: "Тип 2",
        afp_consumption:110,
        liquidParameters: {
          density: 870,
          viscosity: 4.8,
        },
        pipeParameters: {
          diameter: 600,
          wallThickness: 10,
          roughness: 0.012,
          pressure: 12,
        },
      },
      {
        station: "Станция 3",
        flow: 3000,
        pumps: [
          { id: 8, name: "HM 5000-210", numOfPumps: 3, rpm: 3200 },
        ],
        inputPressure: "1580",
        outputPressure: "6334",
        power: "40",
        afpType: "Тип 3",
        length: 121,
        afp_consumption:100,
        liquidParameters: {
          density: 860,
          viscosity: 5.0,
        },
        pipeParameters: {
          diameter: 550,
          wallThickness: 9,
          roughness: 0.011,
          pressure: 11,
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
      }  
  },
});
