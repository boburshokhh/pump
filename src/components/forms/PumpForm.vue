<template>
  <div class="pump-edit">
    <h3 v-if="editMode">Редактировать насосы</h3>
    <h3 v-else>Добавить насос</h3>
    <v-row v-for="(pump, index) in pumps" :key="pump.id" class="pump-container">
      <v-col cols="12">
        <div class="pump-header">
          <h4>Насос {{ index + 1 }}</h4>
          <n-dialog-provider>
            <delete-dialog v-if="index > 0" color="red" dialog-type="warning" dialog-title="Подтверждение удаления"
              dialog-content="Вы уверены, что хотите удалить этот насос? Это действие невозможно отменить."
              positive-text="Удалить" negative-text="Отмена" :index="index" :onPositiveClick="() => deletePump(index)"
              :onNegativeClick="closeDeleteDialog" @delete-clicked="confirmDelete" />
          </n-dialog-provider>
        </div>
      </v-col>
      <!-- <v-col cols="12" md="6">
        <v-text-field 
          v-model="pump.type" 
          :error-messages="errors[index]?.type" 
          label="Тип насоса"
        ></v-text-field>
      </v-col> -->
      <v-col cols="12" md="12">
        <!-- <v-text-field 
          v-model="pump.rotor" 
          :error-messages="errors[index]?.rotor" 
          label="Тип ротора"
        ></v-text-field> -->
        <v-select autocomplete="off" @update:model-value="(value) => onUpdate(value, index)" v-model="selectedPump"
          :item-props="itemProps" :items="options" label="Насос"></v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-number-input :min=0 v-model="pump.numOfPumps" :error-messages="errors[index]?.numOfPumps"
          label="Кол-во насосов"></v-number-input>
      </v-col>
      <v-col cols="12" md="6">
        <v-number-input :min=0 v-model="pump.rpm" :error-messages="errors[index]?.rpm" label="Обороты"></v-number-input>
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
      selectedPump: []
    };
  },
  methods: {
    onUpdate(value,index) {
      console.log("Событие @update:model-value:", value, index);
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
