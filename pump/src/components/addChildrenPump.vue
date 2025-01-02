<template>
  <v-form ref="form" v-model="isFormValid">
    <v-row v-for="(form, index) in forms" :key="index">
      <v-col cols="3">
        <v-text-field v-model="form.pumpType" :rules="[rules.required]" label="Тип насоса" outlined dense
          style="background-color: white"></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="form.rotorType" :rules="[rules.required]" label="Тип рот." outlined dense
          style="background-color: white"></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="form.pumpCount" :rules="[rules.required, rules.isNumber]" label="Кол.нас" outlined dense
          style="background-color: white"></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="form.rotationSpeed" :rules="[rules.required, rules.isNumber]" label="Число обород"
          outlined dense style="background-color: white"></v-text-field>
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
</template>

<script>
export default {
  data() {
    return {
      isFormValid: false,
      forms: [
        {
          rotorType: "",
          pumpCount: "",
          rotationSpeed: "",
          pumpType: "",
        },
      ],
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
    submitForm() {
      const isAllFormsValid = this.forms.every((form) => {
        const isValidRotor = !!form.rotorType;
        const isValidPumpCount =
          !isNaN(Number(form.pumpCount)) && !!form.pumpCount;
        const isValidRotationSpeed =
          !isNaN(Number(form.rotationSpeed)) && !!form.rotationSpeed;
        const isValidPumpType = !!form.pumpType;

        return (
          isValidRotor &&
          isValidPumpCount &&
          isValidRotationSpeed &&
          isValidPumpType
        );
      });

      if (isAllFormsValid) {
        console.log("Все формы успешно отправлены:", this.forms);
      } else {
        console.log("Некоторые формы содержат ошибки.");
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  border-color: white;
}
</style>