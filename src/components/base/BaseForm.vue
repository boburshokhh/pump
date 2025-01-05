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
    <h3>Добавить НПС</h3>
    <v-row>
      <v-col>
        <v-text-field
          v-model="data.station"
          :counter="13"
          :error-messages="errors.station"
          label="Названия НПС"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-number-input
          v-model="data.flow"
          :min="0"
          :reverse="false"
          control-variant="split"
          label="Расход"
          :hideInput="false"
          inset
        ></v-number-input>
      </v-col>
    </v-row>
    <v-form ref="form" v-model="isFormValid">
      <p>Добавить насос</p>
      <v-row v-for="(pump, index) in pumps" :key="index">
        <v-col cols="3">
          <v-text-field
            v-model="pump.type"
            :rules="[rules.required]"
            label="Тип нас."
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="pump.rotor"
            :rules="[rules.required]"
            label="Тип рот."
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-number-input
            v-model="pump.numOfPumps"
            :min="0"
            :reverse="false"
            control-variant="stacked"
            label="Кол.нас"
            :hideInput="false"
            inset
          ></v-number-input>
        </v-col>
        <v-col cols="3">
          <v-number-input
            v-model="pump.rpm"
            :max="600"
            :min="200"
            :step="10"
            control-variant="split"
            label="Число оборотов"
          ></v-number-input>
        </v-col>
      </v-row>
      <!-- <p>{{ stations }}</p> -->
      <v-row class="justify-space-between">
        <v-col cols="auto">
          <v-btn
            outlined
            color="white"
            style="background-color: #333"
            @click="addForm"
          >
            <v-icon left>mdi-plus</v-icon>
            Добавить
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
      },
      errors: {
        station: "",
        flow: "",
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
    /**
     *
     * @param {String} title
     * @param {String} description
     * @param {String} type
     */
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
    /**
     * @param {String} title
     * @param {String} description
     * @param {String} type
     */
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
    validate() {
      let isValid = true;
      if (this.data.station.length < 2) {
        this.errors.station =
          "Названия должно содержать как минимум 2 символа.";
        isValid = false;
      } else {
        this.errors.station = "";
      }
      return isValid;
    },
    validateForm(form) {
      const isValidRotor = !!form.type || "Поле обязательно.";
      const isValidPumpCount =
        (!isNaN(Number(form.rpm)) && !!form.rpm) ||
        "Должно быть числом.";
      const isValidRotationSpeed =
        (!isNaN(Number(form.numOfPumps)) && !!form.numOfPumps) ||
        "Должно быть числом.";
      const isValidPumpType = !!form.rotor || "Поле обязательно.";
      return {
        type: isValidRotor,
        rotor: isValidPumpType,
        numOfPumps: isValidRotationSpeed,
        rpm: isValidPumpCount
      };
    },
    submitForm() {
      const errors = this.pumps.map((form) => this.validateForm(form));
      const isAllFormsValid = errors.every((error) =>
        Object.values(error).every((value) => value === true)
      );
      const isValid = isAllFormsValid && this.validate();
      if (isValid) {
        this.newStation.pumps = [...this.pumps];
        this.newStation.station = this.data.station
        this.newStation.flow = this.data.flow
        this.addNewStation(this.newStation)
        return true;
      }
      this.notificationPost(
        "Ошибка при сохранении",
        "Пожалуйста, заполните все необходимые поля перед сохранением.",
        "error"
      );
      return false;
    },
  },
};
</script>
