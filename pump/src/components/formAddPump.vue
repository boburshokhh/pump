<template>
  <form @submit.prevent="submit">
    <h3>Добавить НПС</h3>
    <v-row>
      <v-col>
        <v-text-field v-model="data.station" :counter="13" :error-messages="errors.station"
          label="Названия НПС"></v-text-field>
      </v-col>
      <v-col>
        <v-number-input v-model="data.flow" :min="0" :reverse="false" control-variant="split" label="Расход" :hideInput="false"
          inset></v-number-input>
      </v-col>
    </v-row>
    <v-form ref="form" v-model="isFormValid">
      <p>Добавить насос</p>
      <v-row v-for="(form, index) in forms" :key="index">
        <v-col cols="3">
          <v-text-field v-model="form.pumpType" :rules="[rules.required]" label="Тип насоса" outlined
            dense></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="form.rotorType" :rules="[rules.required]" label="Тип рот." outlined
            dense></v-text-field>
        </v-col>
        <v-col cols="3">
          <!-- <v-text-field
            v-model="form.pumpCount"
            :rules="[rules.required, rules.isNumber]"
            label="Кол.нас"
            outlined
            dense
          ></v-text-field> -->
          <v-number-input v-model="form.pumpCount" :min="0" :reverse="false" control-variant="stacked" label="Кол.нас"
            :hideInput="false" inset></v-number-input>
        </v-col>
        <v-col cols="3">
          <v-number-input v-model="form.rotationSpeed" :max="600" :min="200" :step="10" control-variant="split"
            label="Число оборотов"></v-number-input>
        </v-col>
      </v-row>
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
import { VNumberInput } from 'vuetify/labs/VNumberInput'
export default {
  components: {
    VNumberInput
  },
  data() {
    return {
      isFormValid: false,
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
    };
  },
  methods: {
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
        this.errors.station = "Названия должно содержать как минимум 2 символа.";
        isValid = false;
      } else {
        this.errors.station = "";
      }
      return isValid;
    },
    validateForm(form) {
      const isValidRotor = !!form.rotorType || "Поле обязательно.";
      const isValidPumpCount =
        !isNaN(Number(form.pumpCount)) && !!form.pumpCount || "Должно быть числом.";
      const isValidRotationSpeed =
        !isNaN(Number(form.rotationSpeed)) && !!form.rotationSpeed || "Должно быть числом.";
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

      if (isAllFormsValid) {
        console.log("Все формы успешно отправлены:", this.forms);
      } else {
        console.log("Некоторые формы содержат ошибки:", errors);
      }
    },
    submit() {
      if (this.validate()) {
        alert(JSON.stringify(this.data, null, 2));
      }
    },
  },
};
</script>
