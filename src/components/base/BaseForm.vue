<template>
  <form @submit.prevent="submit">
    <n-notification-provider>
      <notifications
        v-for="(notification, index) in notificationInfo"
        :key="index"
        :title="notification.title"
        :description="notification.description"
        :type="notification.type"
        :duration="5000"
        ref="notificationComponent"
      />
    </n-notification-provider>

    <h3>Параметры НПС</h3>
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="data.station"
          :counter="13"
          :error-messages="errors.station"
          label="Названия НПС"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-number-input
          v-model="data.flow"
          :min="0"
          :reverse="false"
          control-variant="split"
          label="Расход"
          :error-messages="errors.flow"
          :hideInput="false"
          inset
        ></v-number-input>
      </v-col>
      <v-col cols="12" md="4">
        <v-number-input
          v-model="data.length"
          :min="0"
          :reverse="false"
          control-variant="split"
          label="Длина участка, км"
          :hideInput="false"
          inset
          :error-messages="errors.length"
        ></v-number-input>
      </v-col>
    </v-row>

    <n-collapse v-model:expanded="expandedKeys">
      <n-collapse-item
        title="Параметры жидкости"
        name="1"
        style="border: 1px solid #dcdcdc; border-radius: 8px; padding: 16px"
      >
        <div>
          <LiquidParameters :data="data" :errors="errors" />
        </div>
      </n-collapse-item>
    </n-collapse>
    <br />
    <n-collapse v-model:expanded="expandedKeys">
      <n-collapse-item
        title="Параметры трубы"
        name="1"
        style="border: 1px solid #dcdcdc; border-radius: 8px; padding: 16px"
      >
        <div>
          <PipeParameters :data="data" :errors="errors" />
        </div>
      </n-collapse-item>
    </n-collapse>

    <v-form ref="form" v-model="isFormValid">
      <PumpForm :pumps="pumps" :errors="errors.pumps" />
      <!-- <p>{{ stations }}</p> -->
      <v-row class="justify-space-between">
        <v-col cols="auto">
          <v-btn
            outlined
            color="secondary"
            style="background-color: #333"
            @click="addForm"
          >
            <v-icon left>mdi-plus</v-icon>
            Добавить насос
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn outlined color="primary" @click="submitForm">
            Сохранить
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </form>
</template>

<script>
import { useOptionsStore } from "/src/stores/options";
import { useIndexStore } from "/src/stores/index";
import { VNumberInput } from "vuetify/labs/VNumberInput";
import notifications from "../utils/NotificationComponent.vue";
import LiquidParameters from "../forms/LiquidParameters.vue";
import PipeParameters from "../forms/PipeParameters.vue";
import PumpForm from "../forms/PumpForm.vue";

export default {
  created() {
    this.optionsStore = useOptionsStore();
    this.loadOptions();
  },
  computed: {
    pumpsOptions() {
      return this.optionsStore.selectOptions;
    },
    stations() {
      const store = useIndexStore();
      return store.getStations;
    },
  },
  components: {
    VNumberInput,
    notifications,
    LiquidParameters,
    PipeParameters,
    PumpForm,
  },
  data() {
    return {
      selectedOption: null,
      notificationInfo: [],
      isFormValid: false,
      pumpSelect: null,
      simpleOptions: ["Опция 1", "Опция 2", "Опция 3", "Опция 4"],
      pumps: [
        {
          type: "",
          rotor: "",
          numOfPumps: 0,
          rpm: 0,
        },
      ],
      newStation: {
        station: "Станция X",
        flow: "250",
        pumps: [{ type: "ПНС", rotor: "D-60", numOfPumps: 1, rpm: 1200 }],
        inputPressure: "2200",
        outputPressure: "7200",
        power: "55",
        afpType: "Тип X",
      },
      data: {
        station: "",
        flow: 0,
        length: null,
        density: 850,
        viscosity: 10,
        diameter: 0,
        wallThickness: 0,
        roughness: 0,
        pressure: 0,
      },
      errors: {
        station: "",
        flow: "",
        length: "",
        density: "",
        viscosity: "",
        diameter: "",
        wallThickness: "",
        roughness: "",
        pressure: "",
        pumps: [{ type: "", rotor: "", numOfPumps: "" }],
      },
      rules: {
        required: (value) => !!value || "Поле обязательно для заполнения.",
        isNumber: (value) =>
          !isNaN(Number(value)) || "Значение должно быть числом.",
      },
      notificationComponent: null,
    };
  },
  methods: {
    addNewStation(item) {
      const store = useIndexStore();
      store.addStation(item);
    },
    deleteStation(index) {
      const store = useStationStore();
      store.stations.splice(index, 1);
      alert("Станция удалена!");
    },
    editStation(index) {
      const updatedStation = {
        ...this.stations[index],
        station: "Изменённая станция",
        flow: "300",
      };
      const store = useStationStore();
      store.updateStation(index, updatedStation);
      alert("Станция обновлена!");
    },

    async loadOptions() {
      let res = await this.optionsStore.loadOptions();
      console.log("res", res);
    },
    notificationPost(title, description, type) {
      if (!title || !description || !type) {
        console.warn(
          "Попытка создать пустое уведомление. Проверьте параметры."
        );
        return;
      }
      this.addNotification(title, description, type);
      this.$nextTick(() => {
        if (Array.isArray(this.$refs.notificationComponent)) {
          const lastNotificationIndex = this.notificationInfo.length - 1;
          const lastNotification =
            this.$refs.notificationComponent[lastNotificationIndex];
          if (lastNotification) {
            lastNotification.triggerNotification();
          }
        }
      });
    },
    addNotification(title, description, type) {
      this.notificationInfo.push({ title, description, type });
      setTimeout(() => {
        this.notificationInfo.shift();
      }, 5000);
    },
    addForm() {
      this.pumps.push({
        type: "",
        rotor: "",
        numOfPumps: 0,
        rpm: 0,
      });
    },
    validateForm() {
      let isValid = true;

      if (!this.data.station || this.data.station.trim().length < 2) {
        this.errors.station = "Название должно содержать минимум 2 символа.";
        isValid = false;
      } else {
        this.errors.station = "";
      }

      if (!this.data.flow || this.data.flow <= 0) {
        this.errors.flow = "Расход должен быть больше нуля.";
        isValid = false;
      } else {
        this.errors.flow = "";
      }

      if (!this.data.length || this.data.length <= 0) {
        this.errors.length = "Длина участка должна быть больше нуля.";
        isValid = false;
      } else {
        this.errors.length = "";
      }

      if (!this.data.density || this.data.density <= 0) {
        this.errors.density = "Плотность должна быть больше нуля.";
        isValid = false;
      } else {
        this.errors.density = "";
      }

      if (!this.data.viscosity || this.data.viscosity <= 0) {
        this.errors.viscosity = "Вязкость должна быть больше нуля.";
        isValid = false;
      } else {
        this.errors.viscosity = "";
      }

      if (
        !this.data.diameter ||
        this.data.diameter < 50 ||
        this.data.diameter > 1500
      ) {
        this.errors.diameter =
          "Диаметр должен быть в пределах от 50 до 1500 мм.";
        isValid = false;
      } else {
        this.errors.diameter = "";
      }

      if (
        !this.data.wallThickness ||
        this.data.wallThickness < 2 ||
        this.data.wallThickness > 20
      ) {
        this.errors.wallThickness =
          "Толщина стенки должна быть в пределах от 2 до 20 мм.";
        isValid = false;
      } else {
        this.errors.wallThickness = "";
      }

      if (
        !this.data.roughness ||
        this.data.roughness < 0.001 ||
        this.data.roughness > 10
      ) {
        this.errors.roughness =
          "Шероховатость должна быть в пределах от 0.001 до 10 мм.";
        isValid = false;
      } else {
        this.errors.roughness = "";
      }

      if (
        !this.data.pressure ||
        this.data.pressure < 0.1 ||
        this.data.pressure > 25
      ) {
        this.errors.pressure =
          "Давление должно быть в пределах от 0.1 до 25 МПа.";
        isValid = false;
      } else {
        this.errors.pressure = "";
      }

      return isValid;
    },

    submitForm() {
      const isMainFormValid = this.validateForm();
      const arePumpsValid = this.validatePumps();
      console.log(
        "data:-->",
        this.data,
        "arePumpsValid:",
        arePumpsValid,
        "isMainFormValid--->",
        isMainFormValid
      );
      if (isMainFormValid && arePumpsValid) {
        console.log("Форма отправлена успешно:", this.data);
        this.notificationPost("Успех", "Форма успешно отправлена.", "success");
      } else {
        this.notificationPost("Ошибка", "Исправьте ошибки в форме.", "error");
      }
    },

    validatePumps() {
      let isValid = true;
      this.pumps.forEach((pump, index) => {
        if (!pump.type) {
          if (!this.errors.pumps) this.errors.pumps = [];
          this.errors.pumps[index] = this.errors.pumps[index] || {};
          this.errors.pumps[index].type = "Укажите тип насоса.";
          isValid = false;
        } else {
          if (this.errors.pumps && this.errors.pumps[index]) {
            this.errors.pumps[index].type = "";
          }
        }

        if (!pump.rotor) {
          if (!this.errors.pumps) this.errors.pumps = [];
          this.errors.pumps[index] = this.errors.pumps[index] || {};
          this.errors.pumps[index].rotor = "Укажите тип ротора.";
          isValid = false;
        } else {
          if (this.errors.pumps && this.errors.pumps[index]) {
            this.errors.pumps[index].rotor = "";
          }
        }

        if (!pump.numOfPumps || pump.numOfPumps <= 0) {
          if (!this.errors.pumps) this.errors.pumps = [];
          this.errors.pumps[index] = this.errors.pumps[index] || {};
          this.errors.pumps[index].numOfPumps = "Укажите количество насосов.";
          isValid = false;
        } else {
          if (this.errors.pumps && this.errors.pumps[index]) {
            this.errors.pumps[index].numOfPumps = "";
          }
        }
      });
      return isValid;
    },
  },
};
</script>
