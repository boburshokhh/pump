<template>
  <div class="table">
    <dialogPump />
    <BaseEditForm v-model:dialog="isDialogOpen" :pumpStationIndex="pumpStationIndex" :station="pumpStation" />
    <!-- <SelectComponents /> -->
    <n-flex justify="center" class="table-container">
      <n-table :bordered="true" :single-line="false" >
        <thead>
          <tr>
            <th>Станция</th>
            <th>Расход, м³/ч</th>
            <th>Длина участки, км</th>
            <th>Расход АФП, км</th>
            <th>Насосы</th>
            <th>Количество насосов</th>
            <th>Число оборотов</th>
            <th>Давление на входе МНС,<br />кПа</th>
            <th>Давление на выходе НПС,<br />кПа</th>
            <th>Затрачиваемая мощность, <br />кВт</th>
            <th>Параметры жидкости и трубы</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in stations" :key="index">
            <td @click="openDialog(index, item)">
              <n-tooltip trigger="hover" placement="top">
                <template #trigger>
                  <span class="text-decoration-underline cursor-pointer">
                    {{ item.station }}
                  </span>
                </template>
                <span>Редактировать параметры станции</span>
              </n-tooltip>
            </td>
            <td>{{ item.flow }}</td>
            <td>{{ item.length }}</td>
            <td>{{ item.afp_consumption }}</td>
            <td>
          <tr v-for="(pump) in item.pumps" :key="pump.id">
            <td class="custom-table-border">
              <n-tooltip trigger="hover" placement="top">
                <template #trigger>
                  <span @click="showPumpMoreInfo(pump)" class="text-decoration-underline cursor-pointer">
                    {{ pump.name }}
                  </span>
                </template>
                <span>Нажмите, чтобы увидеть данные насоса</span>
              </n-tooltip>
            </td>
          </tr>
          </td>
          <td>
            <tr v-for="(pump) in item.pumps" :key="pump.id">
              <td class="custom-table-border">
                {{ pump.numOfPumps }}
              </td>
            </tr>
          </td>
          <td>
            <tr v-for="(pump) in item.pumps" :key="pump.id">
              <td class="custom-table-border">
                {{ pump.rpm }}
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
            <PipeAndLiquidParameters :parameters="item" />
          </td>
          </tr>
        </tbody>
      </n-table>
      <pumpInfo ref="pumpModal" v-if="showModalPump" @close="showModalPump = false" :parameters="selectedPumpId" />
    </n-flex>
    <!-- <PipeAndLiquidParameters :parameters="selectedPipe" @close="showModalPipeAndLiquid = false"></PipeAndLiquidParameters> -->
  </div>
</template>

<script>
import dialogPump from "../modals/PumpDialog.vue";
import { useIndexStore } from "../../stores/index";
import { useNotification } from "naive-ui";
import BaseEditForm from "./BaseEditForm.vue";
import PipeAndLiquidParameters from "../table/PipeAndLiquidParameters.vue";
import pumpInfo from "../modals/pumpInfo.vue"

export default {
  components: {
    dialogPump,
    useNotification,
    BaseEditForm,
    PipeAndLiquidParameters,
    pumpInfo
  },
  computed: {
    stations() {
      return this.stationStore.getStations;
    },
  },
  data() {
    return {
      stationStore: useIndexStore(),
      showNotification: false,
      notificationText: "",
      notificationColor: "red",
      notificationComponent: null,
      isDialogOpen: false,
      pumpStation: {},
      pumpStationIndex: 0,
      showModalPipeAndLiquid: false,
      selectedPipe: {},
      selectedPumpId: null,
      showModalPump:false
    };
  },
  methods: {
    openDialog(index, station) {
      this.isDialogOpen = true;
      this.pumpStationIndex = index;
      this.pumpStation = station;
    },
    openPipeAndLiquidParameters(item) {
      this.selectedPipe = item;
      this.showModalPipeAndLiquid = true;
    },
    async fetchData() {
      console.log("Fetching data...");
      await new Promise((resolve) => setTimeout(resolve, 10));
      console.log("Data fetched successfully.");
    },
    validNumOfPumps(value) {
      return value > 0 ? null : "error";
    },
    showPumpMoreInfo(pump) {
        if (!pump || !pump.id) {
            console.error("Неверные данные насоса:", pump);
            return;
        }
        this.showModalPump= true;
        this.selectedPumpId = pump.id;
        setTimeout(()=>{
            this.$refs.pumpModal.open();
        },100)
    },
  },
};
</script>

<style>
.custom-table-border {
  border: none !important;
}

#pumpChart {
  max-width: 100%;
  max-height: 100%;
}

.n-table th {
  white-space: normal !important;
}


.n-table th,
.n-table td {
  white-space: nowrap; /* Предотвращает перенос текста */
}

@media (max-width: 768px) {
  .table-wrapper {
    padding: 0 10px; /* Отступы для маленьких экранов */
  }

  .n-table th,
  .n-table td {
    font-size: 12px; /* Уменьшаем шрифт для компактности */
  }
}

</style>
