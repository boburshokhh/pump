import { defineStore } from 'pinia';
import pumpsData from './storejson/pumps.json'
import powerfulPumpsData from './storejson/powerful_pumps.json'

export const useOptionsStore = defineStore('options', {
    state: () => ({
        selectOptions: {
            centrifugal_pumps: pumpsData.centrifugal_pumps,
            powerful_pumps: powerfulPumpsData.powerful_pumps
        },
        currentPumpType: 'serial'
    }),
    getters: {
        availablePumps: (state) => {
            console.log('Getting available pumps for type:', state.currentPumpType);
            console.log('Powerful pumps available:', state.selectOptions.powerful_pumps);
            console.log('Current selectOptions:', state.selectOptions);
            
            if (state.currentPumpType === 'parallel') {
                return state.selectOptions.powerful_pumps;
            }
            return state.selectOptions.centrifugal_pumps;
        }
    },
    actions: {
        async loadOptions() {
            try {
                this.selectOptions = {
                    ...this.selectOptions,
                    centrifugal_pumps: pumpsData.centrifugal_pumps
                };
            } catch (error) {
                console.error('Ошибка при загрузке опций:', error);
            }
        },

        async createOption(option) {
            try {
                this.selectOptions.centrifugal_pumps.push({ id: Date.now(), ...option });
            } catch (error) {
                console.error('Ошибка при добавлении опции:', error);
            }
        },

        async removeOption(id) {
            try {
                this.selectOptions.centrifugal_pumps = this.selectOptions.centrifugal_pumps.filter(option => option.id !== id);
            } catch (error) {
                console.error('Ошибка при удалении опции:', error);
            }
        },
        findOptionById(id) {
            try {
                const pump = this.selectOptions.centrifugal_pumps.find(option => option.id === id);
                if (!pump) {
                    console.warn(`Насос с ID ${id} не найден`);
                }
                return pump;
            } catch (error) {
                console.error('Ошибка при поиске насоса:', error);
                return null;
            }
        },
        setPumpType(type) {
            console.log('Setting pump type in store:', type);
            this.currentPumpType = type;
        }
    },
});
