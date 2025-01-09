<template>
  <v-row>
    <v-col>
      <v-number-input
        v-model="data.density"
        :error-messages="errors.density"
        label="Плотность, кг/м³"
        control-variant="split"
      ></v-number-input>
    </v-col>
    <v-col>
      <v-number-input
        v-model="data.viscosity"
        :error-messages="errors.viscosity"
        label="Вязкость, сСт"
        control-variant="split"
      ></v-number-input>
    </v-col>
  </v-row>
</template>
  
  <script>
  import { VNumberInput } from "vuetify/labs/VNumberInput";

export default {
  components:{
    VNumberInput,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
    editMode: {
    type: Boolean,
    default: false,
  },
  },
  watch:{
    data(newVal,oldVal){
      console.log("data_newVal:",newVal)
    },
    errors(newVal,oldVal){
      console.log("errors_newVal:",newVal)
    },
  }
};
</script>
  