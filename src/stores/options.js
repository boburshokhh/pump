import { defineStore } from 'pinia';
import pumps from './storejson/pumps.json'

export const useOptionsStore = defineStore('options', {
    state: () => ({
        selectOptions: [],
    }),
    actions: {
        async loadOptions() {
            try {
                this.selectOptions = pumps
            } catch (error) {
                console.error('Ошибка при загрузке опций:', error);
            }
        },

        async createOption(option) {
            try {
                this.selectOptions.push({ id: Date.now(), ...option });
            } catch (error) {
                console.error('Ошибка при добавлении опции:', error);
            }
        },

        async removeOption(id) {
            try {
                this.selectOptions = this.selectOptions.filter(option => option.id !== id);
            } catch (error) {
                console.error('Ошибка при удалении опции:', error);
            }
        },
        findOptionById(id) {
            try {
                const pump = pumps.centrifugal_pumps.find(option => option.id === id);
                if (!pump) {
                    console.warn(`Насос с ID ${id} не найден`);
                }
                return pump;
            } catch (error) {
                console.error('Ошибка при поиске насоса:', error);
                return null;
            }
        },
    },
});
