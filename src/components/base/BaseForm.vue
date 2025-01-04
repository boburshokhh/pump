<template>
  <form @submit.prevent="submit">
    <n-notification-provider>
      <notifications v-for="(notification, index) in notificationInfo" :key="index" :title="notification.title"
        :description="notification.description" :type="notification.type" :duration="5000"
        ref="notificationComponent" />
    </n-notification-provider>
    <h3>Добавить НПС</h3>
    <v-row>
      <v-col>
        <v-text-field v-model="data.station" :counter="13" :error-messages="errors.station"
          label="Названия НПС"></v-text-field>
      </v-col>
      <v-col>
        <v-number-input v-model="data.flow" :min="0" :reverse="false" control-variant="split" label="Расход"
          :hideInput="false" inset></v-number-input>
      </v-col>
    </v-row>
    <v-form ref="form" v-model="isFormValid">
      <p>Добавить насос</p>
      <v-row v-for="(form, index) in forms" :key="index">
        <v-col cols="3">
          <!-- <v-text-field
            v-model="form.pumpType"
            :rules="[rules.required]"
            label="Тип насоса"
            outlined
            dense
          ></v-text-field> -->
          <v-select v-model="pumpSelect" clearable autocomplete="off" label="Тип насоса" :items="items"></v-select>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.rotorType" :rules="[rules.required]" label="Тип рот." outlined
            dense></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-number-input v-model="form.pumpCount" :min="0" :reverse="false" control-variant="stacked" label="Кол.нас"
            :hideInput="false" inset></v-number-input>
        </v-col>
        <v-col cols="3">
          <v-number-input v-model="form.rotationSpeed" :max="600" :min="200" :step="10" control-variant="split"
            label="Число оборотов"></v-number-input>
        </v-col>
      </v-row>
      <!-- <p>{{ options }}</p> -->
      <v-row class="justify-space-between">
        <v-col cols="auto">
          <v-btn outlined color="white" style="background-color: #333" @click="addForm">
            <v-icon left>mdi-plus</v-icon>
            Добавить
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn outlined type="submit" color="primary" @click="submitForm">
            Сохранить
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </form>
</template>

<script>
import { useOptionsStore } from "/src/stores/options";
import { VNumberInput } from "vuetify/labs/VNumberInput";
import notifications from "../utils/NotificationComponent.vue";
export default {
  created() {
    this.optionsStore = useOptionsStore();
    this.loadOptions();
  },
  mounted() { },
  computed: {
    options() {
      return this.optionsStore.selectOptions;
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
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
      forms: [
        {
          rotorType: "",
          pumpCount: 0,
          rotationSpeed: 0,
          pumpType: "",
        },
      ],
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
      this.forms.push({
        rotorType: "",
        pumpCount: "",
        rotationSpeed: "",
        pumpType: "",
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
      const isValidRotor = !!form.rotorType || "Поле обязательно.";
      const isValidPumpCount =
        (!isNaN(Number(form.pumpCount)) && !!form.pumpCount) ||
        "Должно быть числом.";
      const isValidRotationSpeed =
        (!isNaN(Number(form.rotationSpeed)) && !!form.rotationSpeed) ||
        "Должно быть числом.";
      const isValidPumpType = !!form.pumpType || "Поле обязательно.";
      return {
        rotorType: isValidRotor,
        pumpCount: isValidPumpCount,
        rotationSpeed: isValidRotationSpeed,
        pumpType: isValidPumpType,
      };
    },
    submitForm() {
      const errors = this.forms.map((form) => this.validateForm(form));
      const isAllFormsValid = errors.every((error) =>
        Object.values(error).every((value) => value === true)
      );
      if (isAllFormsValid && this.validate()) {
        return isAllFormsValid;
      } else if (!this.validate()) {
        this.notificationPost(
          "Ошибка при сохранении",
          "Пожалуйста, заполните все необходимые поля перед сохранением.",
          "error"
        );
      } else {
        this.notificationPost(
          "Ошибка при сохранении",
          "Пожалуйста, заполните все необходимые поля перед сохранением.",
          "error"
        );
      }
    },
  },
};
</script>
