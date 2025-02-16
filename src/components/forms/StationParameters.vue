<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="data.station"
          :counter="13"
          :error-messages="errors.station"
          label="Названия НПС"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-number-input
          v-model="data.flow"
          :min="0"
          :reverse="false"
          control-variant="split"
          label="Расход, м³/ч"
          :error-messages="errors.flow"
          :hideInput="false"
          inset
        ></v-number-input>
      </v-col>
      <v-col cols="12" md="6">
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
      <v-col cols="12" md="6">
        <v-number-input
          v-model="data.afp_consumption"
          :min="0"
          :reverse="false"
          control-variant="split"
          label="Расход АФП, ppm"
          :hideInput="false"
          inset
          :error-messages="errors.afp_consumption"
        ></v-number-input>
      </v-col>
    </v-row>
  </div>
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
      required: true,
      default: () => ({
        station: '',
        flow: null,
        length: null,
        afp_consumption: null,
      })
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

<style scoped>
.radio-group-wrapper {
  padding: 1rem;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.radio-label {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.radio-label:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.radio-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-control {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.radio-outer {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #e0e0e0;
  border-radius: 50%;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-label.selected .radio-outer {
  border-color: #1976D2;
  transform: scale(1.1);
}

.radio-inner {
  width: 0.625rem;
  height: 0.625rem;
  background-color: #1976D2;
  border-radius: 50%;
  display: block;
}

.radio-label-text {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.87);
  transition: color 0.2s ease;
}

.radio-label.selected .radio-label-text {
  color: #1976D2;
  font-weight: 500;
}

/* Animation for the inner circle */
.radio-enter-active,
.radio-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.radio-enter-from,
.radio-leave-to {
  opacity: 0;
  transform: scale(0);
}

.radio-enter-to,
.radio-leave-from {
  opacity: 1;
  transform: scale(1);
}

@media (hover: hover) {
  .radio-label:hover .radio-outer {
    border-color: #1976D2;
    transform: scale(1.05);
  }
}

@media (max-width: 640px) {
  .radio-group {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>