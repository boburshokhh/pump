<template>
    <n-table :columns="columns" :bordered="true" :single-line="false" :data="data" bordered>
        <thead>
            <tr>
                <th>Плотность, кг/м³</th>
                <th>Вязкость, сСт</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in data" :key="row.parameter">
                <td>{{ row.density }}</td>
                <td>{{ row.viscosity }}</td>
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