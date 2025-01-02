import { defineStore } from "pinia";

export const useStationStore = defineStore("stationStore", {
  state: () => ({
    stations: [
        {
            station: "Станция 1",
            flow: "100 ",
            pumps: [
                { type: "ПНС", rotor: "D-56(ПУУМ)", numOfPumps: 2, rpm: 980 },
                { type: "МНС", rotor: "D-475", numOfPumps: 0, rpm: 2980 },
            ],
            inputPressure: "2345 ",
            outputPressure: "8442 ",
            power: "50",
            afpType: "Тип 1",
        },
        {
            station: "Станция 2",
            flow: "200 ",
            pumps: [
                { type: "ПНС", rotor: "D-56(ПУУМ)", numOfPumps: 2, rpm: 980 },
                { type: "МНС", rotor: "D-475", numOfPumps: 0, rpm: 2980 },
            ],
            inputPressure: "2545 ",
            outputPressure: "9442 ",
            power: "70",
            afpType: "Тип 2",
        },
        {
            station: "Станция 3",
            flow: "150 ",
            pumps: [
                { type: "Вихревой", rotor: "Тип C", numOfPumps: 1, rpm: 1400 },
            ],
            inputPressure: "1580 ",
            outputPressure: "6334 ",
            power: "40",
            afpType: "Тип 3",
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
  },
});
