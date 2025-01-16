<template>
    <n-table :columns="columns" :bordered="true" :single-line="false" :data="data" bordered>
        <thead>
            <tr>
                <th>Диаметр трубы, мм</th>
                <th>Толщина стенки, мм</th>
                <th>Шероховатость, мм</th>
                <th>Рабочее давление, МПа</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in data" :key="row.parameter">
                <td>{{ row.diameter }}</td>
                <td>{{ row.wallThickness }}</td>
                <td>{{ row.roughness }}</td>
                <td>{{ row.pressure }}</td>
            </tr>
        </tbody>
    </n-table>
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

<style>
/* Добавьте стили по желанию */
</style>