<template>
<div>
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
</div>
  </template>
  
  <script>
  import { VNumberInput } from "vuetify/labs/VNumberInput";
  import DeleteDialog from '../utils/DeleteDialog.vue';

  
  export default {
    components: {
      VNumberInput,
      DeleteDialog
    },
    methods: {
    deletePump() {
      if (this.pumpToDelete !== null) {
        this.pumps.splice(this.pumpToDelete, 1);
        this.errors.splice(this.pumpToDelete, 1);
      }
      this.isDeleteDialogVisible = false;
      this.pumpToDelete = null;
    },
  handleCancel() {
    this.isDialogVisible = false;
  },
},
    props: {
      data: {
        type: Object,
        required: true,
      },
      editMode: {
    type: Boolean,
    default: false,
  },
      errors: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  