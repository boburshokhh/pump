<template>
  <form @submit.prevent="submit">
    <Notification ref="notification" />
    <dialogClickCalck
      :dialogTitle="dialogProps.dialogTitle"
      :dialogContent="dialogProps.dialogContent"
      :positiveText="dialogProps.positiveText"
      :dialogType="dialogProps.dialogType"
      :messageText="dialogProps.messageText"
      :messageType="dialogProps.messageType"
      :escMessageType="dialogProps.escMessageType"
      :escMessage="dialogProps.escMessage"
      ref="dialogClickCalck"
    />
    <!-- <h3 v-if="!editMode">Параметры НПС</h3> -->
    <StationParameters :data="data" :errors="errors" :editMode="editMode" />
    <n-collapse v-model:expanded="expandedKeys">
      <n-collapse-item
        title="Параметры жидкости"
        name="1"
        class="pa-4 rounded elevation-1"
      >
        <div>
          <LiquidParameters
            :data="data"
            :errors="errors"
            :editMode="editMode"
          />
        </div>
      </n-collapse-item>
    </n-collapse>

    <br />
    <n-collapse v-model:expanded="expandedKeys">
      <n-collapse-item
        title="Параметры трубы"
        name="1"
        class="pa-4 rounded elevation-1"
      >
        <div>
          <PipeParameters :data="data" :errors="errors" :editMode="editMode" />
        </div>
      </n-collapse-item>
    </n-collapse>
    <SegmentedButtons v-model="data.connectionType" :is-dark="$vuetify.theme.dark"/>
    <v-form ref="form" v-model="isFormValid">
      <div>
        <PumpForm
          v-model:pumps="pumps"
          :errors="errors.pumps"
          :editMode="editMode"
        />
      </div>
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
        <v-col v-if="!editMode" cols="auto">
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
import LiquidParameters from "../forms/LiquidParameters.vue";
import PipeParameters from "../forms/PipeParameters.vue";
import PumpForm from "../forms/PumpForm.vue";
import StationParameters from "../forms/StationParameters.vue";
import { useToast } from "vue-toastification";
import Notification from "../utils/Notification.vue";
import dialogClickCalck from "../utils/dialogClickCalck.vue";
import SegmentedButtons from "../utils/SegmentedButtons.vue";
// import calculationsStore from "../../stores/calculations";

export default {
  created() {
    if (this.editMode && this.stationData) {
      console.log("this.stationData", this.stationData);
      this.initializeEditMode();
    }
    this.optionsStore = useOptionsStore();
    this.loadOptions();
  },
  computed: {
    dialogProps() {
      if (this.editMode) {
        return {
          dialogTitle: "Напоминание",
          dialogContent:
            "После изменения станции проверьте данные в таблице и не забудьте нажать кнопку 'Рассчитать'.",
          positiveText: "Хорошо",
          dialogType: "warning",
          messageText: "Успешно",
          messageType: "success",
          escMessageType: "warning",
          escMessage: "Нажимайте кнопку 'Хорошо' для закрытия диалога",
        };
      } else {
        return {
          dialogTitle: "Напоминание",
          dialogContent:
            "После добавления станции проверьте данные в таблице и не забудьте нажать кнопку 'Рассчитать'.",
          positiveText: "Хорошо",
          dialogType: "warning",
          messageText: "Успешно",
          messageType: "success",
          escMessageType: "warning",
          escMessage: "Нажимайте кнопку 'Хорошо' для закрытия диалога",
        };
      }
    },
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
    LiquidParameters,
    PipeParameters,
    PumpForm,
    StationParameters,
    useToast,
    Notification,
    dialogClickCalck,
    SegmentedButtons,
  },
  props: {
    pumpStationIndex: {
      type: Number,
      required: false,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    stationData: {
      type: Object,
      default: () => null,
    },
  },

  data() {
    return {
      isFormValid: false,
      expandedKeys: null,
      pumps: [
        {
          name: "",
          numOfPumps: 0,
          fact_rpm: 0,
        },
      ],
      data: {
        station: "",
        flow: 2500,
        length: 120,
        density: 850,
        viscosity: 10,
        diameter: 800,
        wallThickness: 12,
        roughness: 0.1,
        pressure: 10,
        afp_consumption: 1,
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
        afp_consumption: "",
        pumps: [{ name: "", numOfPumps: "", fact_rpm: "" }],
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
    initializeEditMode() {
      this.data = {
        station: this.stationData.station || "",
        connectionType: this.stationData.connectionType || 'serial',
        flow: this.stationData.flow || 0,
        density: this.stationData.liquidParameters?.density || 850,
        viscosity: this.stationData.liquidParameters?.viscosity || 10,
        diameter: this.stationData.pipeParameters?.diameter || 0,
        wallThickness: this.stationData.pipeParameters?.wallThickness || 0,
        roughness: this.stationData.pipeParameters?.roughness || 0,
        pressure: this.stationData.pipeParameters?.pressure || 0,
        afp_consumption: this.stationData.afp_consumption || 0,
        length: this.stationData.length || 0,
      };
      this.pumps = [...(this.stationData.pumps || [])];
    },
    addNewStation(item) {
      const store = useIndexStore();
      store.addStation(item);
    },
    deleteStation(index) {
      const store = useIndexStore();
      store.stations.splice(index, 1);
      alert("Станция удалена!");
    },
    updateStation(index, updatedStation) {
      const store = useIndexStore();
      store.updateStation(index, updatedStation);
    },

    async loadOptions() {
      let res = await this.optionsStore.loadOptions();
      // console.log("res", res);
    },
    addForm() {
      const newPump = {
        name: "",
        numOfPumps: 0,
        fact_rpm: 0,
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
        {
          field: "afp_consumption",
          condition: (value) => value > 0,
          message: "Потребление AFP должно быть больше нуля.",
        },
      ];

      let isValid = true;

      validationRules.forEach(({ field, condition, message }) => {
        const value = this.data[field];
        if (!condition(value)) {
          this.errors[field] = message;
          isValid = false;
        } else {
          this.errors[field] = "";
        }
      });

      return isValid;
    },

    /**
     *
     * @param {String} title - Заголовок уведомления.
     * @param {String} message - Сообщение уведомления.
     * @returns {Object} Настройки уведомления.
     */
    getNotificationOptions(title, message) {
      return {
        title: title,
        message: message,
        titleTag: "h5",
        messageTag: "span",
        titleClass: "custom-title",
        messageClass: "custom-message",
      };
    },

    /**
     *
     * @param {Object} options - Настройки текста уведомления.
     * @param {Object} config - Настройки конфигурации уведомления.
     */
    showNotification(options, config = {}) {
      this.$refs.notification.showNotification(options, config);
    },

    submitForm() {
      const isMainFormValid = this.validateForm();
      const arePumpsValid = this.validatePumps();
      if (!isMainFormValid || !arePumpsValid) {
        this.showNotification(
          {
            title: "Ошибка",
            message: "Проверьте правильность заполнения формы.",
          },
          { type: "error", timeout: 5000 }
        );
        return;
      }

      const updatedStation = this.createStationData();
      const notificationMessage = this.editMode
        ? "Данные станции успешно обновлены."
        : "Новая станция успешно добавлена.";

      try {
        if (this.editMode) {
          this.updateStation(this.pumpStationIndex, updatedStation);
        } else {
          this.addNewStation(updatedStation);
        }

        this.showNotification(
          this.getNotificationOptions("Успех", notificationMessage),
          { type: "success", timeout: 3000 }
        );
        // console.log("calculationsStore.pumpResultsFORM", calculationsStore.pumpResults);
        this.$refs.dialogClickCalck.showDialog();
        this.$emit("close");
        // calculationsStore.setCalculateClicked(true);
        
      } catch (error) {
        // console.error("Ошибка при сохранении станции:", error);
        this.showNotification(
          this.getNotificationOptions(
            "Ошибка",
            "Произошла ошибка при сохранении данных. Повторите попытку позже."
          ),
          { type: "error", timeout: 5000 }
        );
      }
    },

    createStationData() {
      return {
        ...this.data,
        pumps: [...this.pumps],
        liquidParameters: {
          density: this.data.density,
          viscosity: this.data.viscosity,
        },
        pipeParameters: {
          diameter: this.data.diameter,
          wallThickness: this.data.wallThickness,
          roughness: this.data.roughness,
          pressure: this.data.pressure,
        },
      };
    },

    validatePumps() {
      let isValid = true;

      this.pumps.forEach((pump, index) => {
        if (!this.errors.pumps) this.errors.pumps = [];
        if (!this.errors.pumps[index]) this.errors.pumps[index] = {};

        // Validate name
        if (!pump.name) {
          this.errors.pumps[index].name = "Выберите насос.";
          isValid = false;
        } else {
          this.errors.pumps[index].name = "";
        }

        // Validate numOfPumps
        if (!pump.numOfPumps || pump.numOfPumps <= 0) {
          this.errors.pumps[index].numOfPumps = "Укажите количество насосов.";
          isValid = false;
        } else {
          this.errors.pumps[index].numOfPumps = "";
        }

        // Validate fact_rpm
        if (!pump.fact_rpm || pump.fact_rpm <= 0) {
          this.errors.pumps[index].fact_rpm =
            "Укажите корректное значение фактической частоты вращения ротора.";
          isValid = false;
        } else if (pump.fact_rpm < 2400 || pump.fact_rpm > 3150) {
          this.errors.pumps[index].fact_rpm =
            "Обороты должны быть от 2400 до 3150.";
          isValid = false;
        } else {
          this.errors.pumps[index].fact_rpm = "";
        }
      });

      return isValid;
    },
  },
};
</script>
