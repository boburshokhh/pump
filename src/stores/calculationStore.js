import { defineStore } from 'pinia'
import { useIndexStore } from './index'
import { useOptionsStore } from './options'
import { calculatePumpEfficiency } from '../components/calculation/calculation'

export const useCalculationsStore = defineStore('calculations', {
    state: () => ({
        results: {
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
        lastCalculationTime: null,
    }),

    getters: {
        getResults: (state) => state.results,
        getHeadLoss: (state) => state.results.head_loss,
        getHIn: (state) => state.results.h_in,
        getHOut: (state) => state.results.h_out,
        getLengthPipeline: (state) => state.results.lengthPipeline,
        getConsumptionStation: (state) => state.results.consumptionStation,
        getSpeed: (state) => state.results.speed,
        getRe: (state) => state.results.Re,
        getDhPump: (state) => state.results.dh_pump,
        isCalculationInProgress: (state) => state.isCalculating,
    },

    actions: {
        updateResults(newResults) {
            this.results = { ...newResults }
            this.lastCalculationTime = new Date().toISOString()
        },

        async recalculate() {
            try {
                this.isCalculating = true;
        
                const calculationResults = calculatePumpEfficiency();
                if (!calculationResults || typeof calculationResults !== "object") {
                    throw new Error("Invalid calculation results");
                }
        
                this.updateResults(calculationResults);
                return calculationResults;
            } catch (error) {
                console.error("Error during calculations:", error);
                throw error;
            } finally {
                this.isCalculating = false;
            }
        },
        

        async forceRecalculate() {
            // Принудительный перерасчет
            return await this.recalculate()
        },

        // Сброс состояния до начальных значений
        resetCalculations() {
            this.results = {
                head_loss: [],
                h_in: [],
                h_out: [],
                lengthPipeline: [],
                consumptionStation: [],
                speed: [],
                Re: [],
                dh_pump: []
            }
            this.lastCalculationTime = null
            this.isCalculating = false
        }
    }
})