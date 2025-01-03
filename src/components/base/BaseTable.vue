<template>
  <div class="table">
    <n-notification-provider>
      <notifications
        title="Ошибка"
        ref="notificationComponent"
        description="Заполните вся необходимые поля "
        :duration="5000"
        type="error"
        :asyncHandler="fetchData"
      />
    </n-notification-provider>
    <dialogPump />
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
                  <n-input-number
                    :status="validNumOfPumps(pump.numOfPumps)"
                    v-model:value="pump.numOfPumps"
                    clearable
                  />
                </td>
              </tr>
            </td>
            <td>
              <tr v-for="(pump, pIndex) in item.pumps" :key="pIndex">
                <td class="custom-table-border">
                  <n-input-number
                    :status="validNumOfPumps(pump.rpm)"
                    v-model:value="pump.rpm"
                    clearable
                  />
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
import { useStationStore } from "../../stores/index";
import notifications from "../utils/NotificationComponent.vue";
import { useNotification } from "naive-ui";

export default {
  components: {
    dialogPump,
    notifications,
    useNotification,
  },
  computed: {
    stations() {
      return this.stationStore.getStations;
    },
  },
  data() {
    return {
      stationStore: useStationStore(),
      showNotification: false,
      notificationText: "",
      notificationColor: "red",
      notificationComponent: null,
    };
  },
  methods: {
    async fetchData() {
      console.log("Fetching data...");
      await new Promise((resolve) => setTimeout(resolve, 10));
      console.log("Data fetched successfully.");
    },
    onNotificationTrigger() {
      console.log("Notification triggered.");
    },
    triggerError() {
      this.notificationText = "Произошла ошибка!";
      this.notificationColor = "red";
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 5000);
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
