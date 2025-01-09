<template>
  <form @submit.prevent="submit">
    <n-notification-provider>
      <notifications v-for="(notification, index) in notificationInfo" :key="index" :title="notification.title"
        :description="notification.description" :type="notification.type" :duration="5000"
        ref="notificationComponent" />
    </n-notification-provider>

    <h3>Параметры НПС</h3>
    <StationParameters :data="data" :errors="errors" />

    <n-collapse v-model:expanded="expandedKeys">
      <n-collapse-item title="Параметры жидкости" name="1"
        style="border: 1px solid #dcdcdc; border-radius: 8px; padding: 16px">
        <div>
          <LiquidParameters :data="data" :errors="errors" />
        </div>
      </n-collapse-item>
    </n-collapse>

    <br />

    <n-collapse v-model:expanded="expandedKeys">
      <n-collapse-item title="Параметры трубы" name="1"
        style="border: 1px solid #dcdcdc; border-radius: 8px; padding: 16px">
        <div>
          <PipeParameters :data="data" :errors="errors" />
        </div>
      </n-collapse-item>
    </n-collapse>

    <v-form ref="form" v-model="isFormValid">
      <div>
        <PumpForm v-model:pumps="pumps" :errors="errors.pumps" />

      </div>
      <v-row class="justify-space-between">
        <v-col cols="auto">
          <v-btn outlined color="secondary" style="background-color: #333" @click="addForm">
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
import StationParameters from "../forms/StationParameters.vue";

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
    StationParameters,
  },
  data() {
    return {
      notificationInfo: [],
      isFormValid: false,
      expandedKeys: null,
      pumps: [
        {
          type: "",
          rotor: "",
          numOfPumps: 0,
          rpm: 0,
        },
      ],
      newStation: {
        station: "",
        flow: "",
        pumps: [{ type: "", rotor: "", numOfPumps: 0, rpm: 0 }],
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
      const newPump = {
        type: "",
        rotor: "",
        numOfPumps: 0,
        rpm: 0,
      };
      this.pumps.push(newPump);
    },

    validateForm() {
      const validationRules = [
        {
          field: "station",
          condition: (value) => value && value.trim().length >= 2,
          message: "Название должно содержать минимум 2 символа.",
        },
        {
          field: "flow",
          condition: (value) => value > 0,
          message: "Расход должен быть больше нуля.",
        },
        {
          field: "length",
          condition: (value) => value > 0,
          message: "Длина участка должна быть больше нуля.",
        },
        {
          field: "density",
          condition: (value) => value > 0,
          message: "Плотность должна быть больше нуля.",
        },
        {
          field: "viscosity",
          condition: (value) => value > 0,
          message: "Вязкость должна быть больше нуля.",
        },
        {
          field: "diameter",
          condition: (value) => value >= 50 && value <= 1500,
          message: "Диаметр должен быть в пределах от 50 до 1500 мм.",
        },
        {
          field: "wallThickness",
          condition: (value) => value >= 2 && value <= 20,
          message: "Толщина стенки должна быть в пределах от 2 до 20 мм.",
        },
        {
          field: "roughness",
          condition: (value) => value >= 0.001 && value <= 10,
          message: "Шероховатость должна быть в пределах от 0.001 до 10 мм.",
        },
        {
          field: "pressure",
          condition: (value) => value >= 0.1 && value <= 25,
          message: "Давление должно быть в пределах от 0.1 до 25 МПа.",
        },
      ];

      let isValid = true;

      validationRules.forEach(({ field, condition, message }) => {
        if (!condition(this.data[field])) {
          this.errors[field] = message;
          isValid = false;
        } else {
          this.errors[field] = "";
        }
      });
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
