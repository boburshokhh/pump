<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-number-input
        v-model="data.diameter"
        :error-messages="errors.diameter"
        label="Диаметр трубы, мм"
        control-variant="split"
        :min="50"
        :max="1500"
        :step="10"
      ></v-number-input>
    </v-col>
    <v-col cols="12" md="6">
      <v-number-input
        v-model="data.wallThickness"
        :error-messages="errors.wallThickness"
        label="Толщина стенки, мм"
        control-variant="split"
        :min="2"
        :max="20"
        :step="0.1"
      ></v-number-input>
    </v-col>
    <v-col cols="12" md="6">
      <v-number-input
        v-model="data.roughness"
        :error-messages="errors.roughness"
        label="Шероховатость, мм"
        control-variant="split"
        :min="0.001"
        :max="10"
        :step="0.001"
      ></v-number-input>
    </v-col>
    <v-col cols="12" md="6">
      <v-number-input
        v-model="data.pressure"
        :error-messages="errors.pressure"
        label="Рабочее давление, МПа"
        control-variant="split"
        :min="0.1"
        :max="25"
        :step="0.1"
      ></v-number-input>
    </v-col>
  </v-row>
</template>

<script>
import { VNumberInput } from "vuetify/labs/VNumberInput";

export default {
  components: {
    VNumberInput,
  },
  props: {
    data: {
      type: Object,
      default: () => ({
        diameter: 500,
        wallThickness: 8,
        roughness: 0.01,
        pressure: 10,
      }),
    },
    editMode: {
    type: Boolean,
    default: false,
  },
    errors: {
      type: Object,
      default: () => ({
        diameter: "",
        wallThickness: "",
        roughness: "",
        pressure: "",
      }),
    },
  },
};
</script>

<style scoped>
</style>
