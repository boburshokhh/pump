<template>
    <div class="table-wrapper">
        <n-table :columns="columns" 
                :bordered="true" 
                :single-line="false" 
                :data="data" 
                class="custom-table"
                bordered>
            <thead>
                <tr class="header-row">
                    <th class="header-cell">Диаметр трубы, мм</th>
                    <th class="header-cell">Толщина стенки, мм</th>
                    <th class="header-cell">Шероховатость, мм</th>
                    <th class="header-cell">Рабочее давление, МПа</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in data" 
                    :key="row.parameter"
                    class="data-row">
                    <td class="data-cell">{{ row.diameter }}</td>
                    <td class="data-cell">{{ row.wallThickness }}</td>
                    <td class="data-cell">{{ row.roughness }}</td>
                    <td class="data-cell">{{ row.pressure }}</td>
                </tr>
            </tbody>
        </n-table>
    </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        parameters: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            data: [],
        };
    },
    created() {
        this.data.push(this.parameters);
    },
});
</script>

<style scoped>
.table-wrapper {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.table-wrapper:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.custom-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
}

.header-row {
    background-color: #f5f7fa;
}

.header-cell {
    padding: 12px;
    font-weight: 600;
    color: #2c3e50;
    text-align: center;
    transition: background-color 0.2s ease;
}

.data-row {
    transition: background-color 0.2s ease;
}

.data-row:hover {
    background-color: #f8f9fa;
}

.data-cell {
    padding: 12px;
    text-align: center;
    color: #34495e;
}

@media (max-width: 768px) {
    .custom-table {
        min-width: 600px;
    }

    .header-cell, .data-cell {
        padding: 8px;
        font-size: 0.9rem;
    }
}
</style>