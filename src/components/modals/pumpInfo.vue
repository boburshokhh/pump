<template>
    <v-dialog activator="parent" @update:modelValue="handleDialogClose" v-model="isOpen" max-width="40%">
        <template v-slot:default>
            <v-card rounded="lg">
                <v-card-title class="d-flex justify-space-between align-center">
                    <div class="text-medium-emphasis ps-2">
                        Параметры насоса
                    </div>
                    <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
                </v-card-title>
                <v-divider class="mb-4"></v-divider>
                <n-flex justify="center" align="center">
                            <div class="table-container">
                                <!-- Вертикальная таблица -->
                                <table class="vertical-table">
                                    <tbody>
                                        <tr v-for="(column, index) in columns" :key="index">
                                            <th>{{ column.title }}</th>
                                            <td>{{ tableData[0]?.[column.key] || "—" }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                </n-flex>
                <v-divider class="mt-2"></v-divider>
                <v-card-actions class="my-2 d-flex justify-end">
                    <v-btn class="text-none" variant="tonal" rounded="xl" @click="close">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import { useOptionsStore } from '../../stores/options'
export default {
    props: {
        parameters: {
            type: [Object, Number],
            required: false,
        },
    },
    data() {
        return {
            tableData: [],
            isOpen: false,
            pumpData: null,
            columns: [
                { title: "Название", key: "name" },
                { title: "Тип", key: "type" },
                { title: "Макс. производительность, м³/ч", key: "max_capacity_m3_per_hour" },
                { title: "Мин. производительность, м³/ч", key: "min_capacity_m3_per_hour" },
                { title: "Макс. обороты, об/мин", key: "max_rpm" },
                { title: "Мин. обороты, об/мин", key: "min_rpm" },
                { title: "КПД, %", key: "efficiency_percent" },
                { title: "Параметр A", key: "a_approc" },
                { title: "Параметр B", key: "b_approc" },
            ],
        };
    },
    created() {
        const pump = useOptionsStore().findOptionById(this.parameters)
        console.log(pump)
        this.tableData.push(pump);
    },
    methods: {
        open() {
            this.isOpen = true;
        },
        close() {
            this.isOpen = false;
            this.$emit('close'); // Сообщаем о закрытии
        },
        handleDialogClose(value) {
            if (!value) {
                this.close();
            }
        },
    },
};
</script>

<style>
.table-container {
    overflow-x: auto;
}

.vertical-table {
    width: 90%;
    border-collapse: collapse;
}

.vertical-table th {
    text-align: left;
    font-weight: bold;
    padding: 8px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    white-space: nowrap;
}

.vertical-table td {
    padding: 8px;
    border: 1px solid #ddd;
    white-space: nowrap;
}

@media (max-width: 768px) {

    .vertical-table th,
    .vertical-table td {
        font-size: 12px;
    }
}
</style>
