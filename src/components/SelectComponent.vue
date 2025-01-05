<template>
  <v-container>
    <h2>Демонстрация возможностей v-select</h2>
    <v-row>
      <v-col>
        <h3>Простой v-select</h3>
        <v-select
          v-model="selectedOption"
          :items="simpleOptions"
          label="Выберите опцию"
        ></v-select>
        <p>Выбранная опция: {{ selectedOption }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>v-select с объектами</h3>
        <v-select
          v-model="selectedObject"
          :items="objectOptions"
          label="Выберите объект"
          item-value="value"
          item-title="text"
        ></v-select>
        <p>Выбранный объект: {{ selectedObject }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>v-select с фильтрацией</h3>
        <v-select
          v-model="filteredOption"
          :items="filteredOptions"
          :filter="customFilter"
          label="Фильтрованные опции"
        ></v-select>
        <p>Выбранная опция: {{ filteredOption }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Множественный выбор</h3>
        <v-select
          v-model="multipleOptions"
          :items="simpleOptions"
          multiple
          label="Выберите несколько опций"
        ></v-select>
        <p>Выбранные опции: {{ multipleOptions }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>
  
  <script>
export default {
  name: "AdvancedSelect",
  data() {
    return {
      selectedOption: null,
      simpleOptions: ["Опция 1", "Опция 2", "Опция 3", "Опция 4"],
      selectedObject: null,
      objectOptions: [
        { value: "pump1", text: "Насос 1" },
        { value: "pump2", text: "Насос 2" },
        { value: "pump3", text: "Насос 3" },
      ],
      filteredOption: null,
      filteredOptions: ["Apple", "Banana", "Cherry", "Date", "Grape"],
      multipleOptions: [],
    };
  },
  methods: {
    customFilter(value, search, item) {
      const text = item.toLowerCase();
      return text.includes(search.toLowerCase());
    },
  },
};
</script>