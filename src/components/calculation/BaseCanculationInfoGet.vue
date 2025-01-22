<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card class="mb-6">
                    <v-card-title class="text-h5">
                        Расчет эффективности насосных станций
                    </v-card-title>

                    <v-card-text>
                        <v-row>
                            <v-col v-if="isCalculating" cols="12" class="text-center">
                                <v-progress-circular
                                    indeterminate
                                    color="primary"
                                    :size="50"
                                ></v-progress-circular>
                            </v-col>
                            <v-col v-else v-for="(_, index) in pumpResults.consumptionStation" :key="index" cols="12" md="6">
                                <v-card variant="outlined">
                                    <v-card-title class="text-subtitle-1">
                                        Станция {{ index + 1 }}
                                    </v-card-title>

                                    <v-card-text>
                                        <v-list lines="one">
                                            <!-- Основные параметры -->
                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon icon="mdi-pump" color="primary" class="mr-2"></v-icon>
                                                </template>
                                                <v-list-item-title>Расход</v-list-item-title>
                                                <v-list-item-subtitle class="text-right">
                                                    {{ formatNumber(pumpResults.consumptionStation[index]) }} м³/ч
                                                </v-list-item-subtitle>
                                            </v-list-item>

                                            <v-divider></v-divider>

                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon icon="mdi-arrow-up-bold" color="primary" class="mr-2"></v-icon>
                                                </template>
                                                <v-list-item-title>Напор насоса</v-list-item-title>
                                                <v-list-item-subtitle class="text-right">
                                                    {{ formatNumber(pumpResults.dh_pump[index]) }} м
                                                </v-list-item-subtitle>
                                            </v-list-item>

                                            <v-divider></v-divider>

                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon icon="mdi-arrow-left-bold" color="primary" class="mr-2"></v-icon>
                                                </template>
                                                <v-list-item-title>Входной напор</v-list-item-title>
                                                <v-list-item-subtitle class="text-right">
                                                    {{ formatNumber(pumpResults.h_in[index]) }} м
                                                </v-list-item-subtitle>
                                            </v-list-item>

                                            <v-divider></v-divider>

                                            <v-list-item>
                                                <template v-slot:prepend>
                                                    <v-icon icon="mdi-arrow-right-bold" color="primary" class="mr-2"></v-icon>
                                                </template>
                                                <v-list-item-title>Выходной напор</v-list-item-title>
                                                <v-list-item-subtitle class="text-right">
                                                    {{ formatNumber(pumpResults.h_out[index]) }} м
                                                </v-list-item-subtitle>
                                            </v-list-item>

                                            <v-divider></v-divider>

                                            <v-expansion-panels variant="accordion">
                                                <v-expansion-panel>
                                                    <v-expansion-panel-title>
                                                        Дополнительные параметры
                                                    </v-expansion-panel-title>
                                                    <v-expansion-panel-text>
                                                        <v-list lines="one">
                                                            <v-list-item>
                                                                <v-list-item-title>Потери напора</v-list-item-title>
                                                                <v-list-item-subtitle class="text-right">
                                                                    {{ formatNumber(pumpResults.head_loss[index]) }} м
                                                                </v-list-item-subtitle>
                                                            </v-list-item>

                                                            <v-divider></v-divider>

                                                            <v-list-item>
                                                                <v-list-item-title>Скорость потока</v-list-item-title>
                                                                <v-list-item-subtitle class="text-right">
                                                                    {{ formatNumber(pumpResults.speed[index]) }} м/с
                                                                </v-list-item-subtitle>
                                                            </v-list-item>

                                                            <v-divider></v-divider>

                                                            <v-list-item>
                                                                <v-list-item-title>Число Рейнольдса</v-list-item-title>
                                                                <v-list-item-subtitle class="text-right">
                                                                    {{ formatNumber(pumpResults.Re[index]) }}
                                                                </v-list-item-subtitle>
                                                            </v-list-item>
                                                        </v-list>
                                                    </v-expansion-panel-text>
                                                </v-expansion-panel>
                                            </v-expansion-panels>
                                        </v-list>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import {computed, watch } from "vue";
import { useIndexStore } from "../../stores/index";
import { useOptionsStore } from "../../stores/options";
import { useCalculationsStore } from "../../stores/calculations";
import PumpChart from "../features/PumpChart.vue";
import BaseTable from "../base/BaseTable.vue";

export default {
    name: "PumpEfficiencyCalculator",
    components: {
        PumpChart,
        BaseTable,
    },
    setup() {
        const indexStore = useIndexStore();
        const optionsStore = useOptionsStore();
        const calculationsStore = useCalculationsStore();
        
        const pumpResults = computed(() => calculationsStore.getPumpResults);

        const formatNumber = (value) => {
            if (typeof value !== "number") return "-";
            return value.toFixed(2);
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

        return {
            pumpResults,
            formatNumber,
            isCalculating: computed(() => calculationsStore.getIsCalculating),
        };
    },
};
</script>
