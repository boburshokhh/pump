import { defineStore } from 'pinia';
import { calculatePumpEfficiency } from '../components/calculation/calculation';

export const useCalculationsStore = defineStore('calculations', {
    state: () => ({
        pumpResults: {
            head_loss: [],
            h_in: [],
            h_out: [],
            lengthPipeline: [],
            consumptionStation: [],
            speed: [],
            Re: [],
            dh_pump: []
        },
        isCalculating: false,
        lastUpdateTime: null,
        calculateClicked: false,
    }),

    getters: {
        getPumpResults: (state) => state.pumpResults,
        getIsCalculating: (state) => state.isCalculating,
        getLastUpdateTime: (state) => state.lastUpdateTime,
    },

    actions: {
        updateCalculations() {
            this.isCalculating = true;
            try {
                const results = calculatePumpEfficiency();
                this.pumpResults = {
                    head_loss: results.head_loss,
                    h_in: results.h_in,
                    h_out: results.h_out,
                    lengthPipeline: results.lengthPipeline,
                    consumptionStation: results.consumptionStation,
                    speed: results.speed,
                    Re: results.Re,
                    dh_pump: results.dh_pump
                };
                this.lastUpdateTime = new Date().toISOString();
            } catch (error) {
                console.error('Error calculating pump efficiency:', error);
            } finally {
                this.isCalculating = false;
            }
        },
        setCalculateClicked(value) {
            this.calculateClicked = value;
        },
    },
}); 