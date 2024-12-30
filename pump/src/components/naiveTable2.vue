<template>
    <div class="table">
        <dialogPump/>
        <n-flex justify="center">
        <n-table :bordered="true" :single-line="false" >
            <thead>
                <tr>
                    <th style="width: 8%;">Станция</th>
                    <th>Расход, м³/ч</th>
                    <th>Тип насоса</th>
                    <th style="width: 12%;">Тип ротора</th>
                    <th>Количество насосов</th> 
                    <th>Число оборотов</th>
                    <th>Давление на входе МНС,<br>кПа</th>
                    <th>Давление на выходе НПС,<br>кПа</th>
                    <th>Затрачиваемая мощность,
                        <br>кВт</th>
                    <th>Тип АФП</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in data" :key="index">
                    <td>{{ item.station }}</td>
                    <td>{{ item.flow }}</td>
                    <td>
                <tr v-for="(pump, pIndex) in item.pumps" :key="pIndex">
                    <td class="custom-table-border">{{ pump.type }}</td>
                </tr>
                </td>
                <td>
                    <tr v-for="(pump, pIndex) in item.pumps" :key="pIndex">
                        <td class="custom-table-border">{{ pump.rotor }}</td>
                    </tr>
                </td>
                <td>
                    <tr v-for="(pump, pIndex) in item.pumps" :key="pIndex">
                        <td class="custom-table-border">
                            <n-input-number :status="validNumOfPumps(pump.numOfPumps)" v-model:value="pump.numOfPumps"
                                clearable />
                        </td>
                    </tr>
                </td>
                <td>
                    <tr v-for="(pump, pIndex) in item.pumps" :key="pIndex">
                        <td class="custom-table-border">
                            <n-input-number :status="validNumOfPumps(pump.rpm)" v-model:value="pump.rpm" clearable />
                        </td>
                    </tr>
                </td>
                <td>
                    {{ item.inputPressure }}
                </td>
                <td>
                    {{ item.outputPressure }}
                </td>
                <td>
                    {{ item.power }}
                </td>
                <td>
                    {{ item.afpType }}
                </td>
                </tr>
            </tbody>
        </n-table>
    </n-flex>
    </div>
</template>

<script>
import dialogPump from '../components/dialogPump.vue'
export default {
    components:{
        dialogPump
    },
    data() {
        return {
            data: [
                
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
        };
    },
    methods: {
        validNumOfPumps(value) {
            return value > 0 ? null : "error";
        },
    }
};
</script>

<style>
.custom-table-border {
    border: none !important;
}
#pumpChart{
    max-width: 100%;
    max-height: 100%;
}
.n-table th{
    white-space:normal !important;
}
</style>
