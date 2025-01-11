<template>
  <div class="table">
    <n-notification-provider>
      <notifications title="Ошибка" ref="notificationComponent" description="Заполните вся необходимые поля "
        :duration="5000" type="error" :asyncHandler="fetchData" />
    </n-notification-provider>
    <dialogPump />
    <BaseEditForm v-model:dialog="isDialogOpen" :pumpStationIndex="pumpStationIndex" :station="pumpStation" />
    <!-- <SelectComponents /> -->
    <n-flex justify="center">
      <n-table :bordered="true" :single-line="false">
        <thead>
          <tr>
            <th style="width: 8%">Станция</th>
            <th>Расход, м³/ч</th>
            <th>Тип насоса</th>
            <th style="width: 12%">Тип ротора</th>
            <th>Количество насосов</th>
            <th>Число оборотов</th>
            <th>Давление на входе МНС,<br />кПа</th>
            <th>Давление на выходе НПС,<br />кПа</th>
            <th>Затрачиваемая мощность, <br />кВт</th>
            <th>Тип АФП</th>
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
            <td>
          <tr v-for="(pump, pIndex) in item.pumps" :key="pIndex">
            <td class="custom-table-border">{{ pump.type }}</td>
          </tr>
          </td>
          <td>
            <tr v-for="(pump, pIndex) in item.pumps" :key="pIndex">
              <td class="custom-table-border ">{{ pump.rotor }}</td>
            </tr>
          </td>
          <td>
            <tr v-for="(pump, pIndex) in item.pumps" :key="pIndex">
              <td class="custom-table-border" >
                {{ pump.numOfPumps }}
              </td>
            </tr>            
          </td>
          <td>
            <tr v-for="(pump, pIndex) in item.pumps" :key="pIndex">
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
            {{ item.afpType }}
          </td>
          </tr>
        </tbody>
      </n-table>
    </n-flex>
  </div>
</template>

<script>
import dialogPump from "../modals/PumpDialog.vue";
import { useIndexStore } from "../../stores/index";
import notifications from "../utils/NotificationComponent.vue";
import { useNotification } from "naive-ui";
import BaseEditForm from "./BaseEditForm.vue";

export default {
  components: {
    dialogPump,
    notifications,
    useNotification,
    BaseEditForm,
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
    };
  },
  methods: {
    openDialog(index, station) {
      this.isDialogOpen = true;
      this.pumpStationIndex = index;
      this.pumpStation = station;
    },
    async fetchData() {
      console.log("Fetching data...");
      await new Promise((resolve) => setTimeout(resolve, 10));
      console.log("Data fetched successfully.");
    },
    validNumOfPumps(value) {
      return value > 0 ? null : "error";
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

.table-container {
  overflow-x: auto;
  max-width: 100%;
}
.custom-text-center{
  justify-content: center;
    display: grid;
}

@media (max-width: 768px) {
  .table-container table {
    font-size: 14px;
  }

  .table-container th,
  .table-container td {
    white-space: nowrap;
  }
}
</style>
