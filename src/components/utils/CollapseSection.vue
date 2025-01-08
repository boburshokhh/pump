<template>
    <v-card class="mb-4">
      <v-card-title @click="toggle">
        <v-btn
          icon
          class="mr-2"
          :aria-label="isOpen ? 'Скрыть' : 'Показать'"
        >
          <v-icon>{{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
        {{ title }}
      </v-card-title>
      <v-card-text v-if="isOpen">
        <slot />
      </v-card-text>
    </v-card>
  </template>
  <script>
export default {
  name: "CollapseSection",
  props: {
    title: {
      type: String,
      required: true,
    },
    defaultOpen: {
      type: Boolean,
      default: false, // Секция изначально свернута
    },
  },
  data() {
    return {
      isOpen: this.defaultOpen, // Управление состоянием секции
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen; // Переключение состояния
    },
  },
};
</script>
