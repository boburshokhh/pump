<template>
  <div class="pump-edit mt-8">
    <v-row v-for="(pump, index) in pumps" :key="pump.id" class="pump-container rounded elevation-1 pa-3 ">
      <v-col cols="12">
        <div class="pump-header d-flex justify-space-between align-center">
          <h4>Насос {{ index + 1 }}</h4>
          <n-dialog-provider>
            <delete-dialog
              v-if="index > 0"
              color="red"
              dialog-type="warning"
              dialog-title="Подтверждение удаления"
              dialog-content="Вы уверены, что хотите удалить этот насос? Это действие невозможно отменить."
              positive-text="Удалить"
              negative-text="Отмена"
              :index="index"
              :onPositiveClick="() => deletePump(index)"
              :onNegativeClick="closeDeleteDialog"
              @delete-clicked="confirmDelete"
            />
          </n-dialog-provider>
        </div>
      </v-col>
      <v-col cols="12" md="12">
        <v-select
          autocomplete="off"
          @update:model-value="(value) => onUpdate(value, index)"
          :item-props="itemProps"
          :items="options"
          v-model="selectedPumps[index]"
          label="Насос"
        ></v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-number-input
          :min="0"
          autocomplete="off"
          v-model="pump.numOfPumps"
          :error-messages="errors[index]?.numOfPumps"
          label="Кол-во насосов"
        ></v-number-input>
      </v-col>
      <v-col cols="12" md="6">
        <div class="d-flex align-center">
          <v-number-input
            :min="0"
            autocomplete="off"
            :max="5000"
            v-model="pump.fact_rpm"
            :error-messages="errors[index]?.fact_rpm"
            label="Ном. частота вращения, об./мин"
          ></v-number-input>
          <!-- <v-icon color="blue" class="ml-2" small>mdi-information</v-icon>
          <span class="ml-2 text-caption">Допустимый диапазон: 2400–3150</span> -->
        </div>
      </v-col>
      
    </v-row>
  </div>
</template>
<script>
import { VNumberInput } from "vuetify/labs/VNumberInput";
import DeleteDialog from "../utils/DeleteDialog.vue";
import { useOptionsStore } from "../../stores/options"

export default {
  components: {
    VNumberInput,
    DeleteDialog,
  },
  setup() {
    const optionsStore = useOptionsStore();
    return {
      optionsStore,
      options: optionsStore.selectOptions.centrifugal_pumps, // Передаем options сразу
    };
  },
  mounted() {
    if (this.editMode) {
      // console.log("pumps:",this.pumps);

      this.selectedPumps = this.options.filter(option =>
        this.pumps.some(pump => pump.id === option.id)
      );
    }
  },
  props: {
    editMode: {
      type: Boolean,
      required: false
    },
    pumps: {
      type: Array,
      required: true,
    },
    errors: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isDeleteDialogVisible: false,
      pumpToDelete: null,
      selectedPumps: []
    };
  },
  methods: {
    onUpdate(value, index) {
      // console.log("Событие @update:model-value:", value, index,"selectedPump",this.selectedPump);
      this.pumps[index].name = value.name;
      this.pumps[index].id = value.id;
    },

    itemProps(item) {
      return {
        title: item.name,
        subtitle: item.type,
      }
    },
    confirmDelete(index) {
      this.pumpToDelete = index;
      this.isDeleteDialogVisible = true;
    },
    deletePump(index) {
      this.pumps.splice(index, 1);
      if (this.errors && this.errors.length > index) {
        this.errors.splice(index, 1);
      }
    },
    closeDeleteDialog() {
      this.isDeleteDialogVisible = false;
      this.pumpToDelete = null;
    },
  },
  watch: {
    selectedPump(newVal) {
      console.log("selectedPump", newVal);
    },
  },
};
</script>

<style>
.pump-container {
  border: 1px solid rgb(220, 220, 220);
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 16px;
  margin-left: 0;
  margin-right: 0;
}

.pump-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pump-add {
  margin-top: 12px;
}

.v-overlay--active {
  z-index: 9999 !important;
  /* Установите значение выше конфликтующих */
}
</style>
