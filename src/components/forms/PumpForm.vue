<template>
  <div class="pump-add">
    <h3>Добавить насос</h3>
    <v-row v-for="(pump, index) in pumps" :key="index" class="pump-container">
      <v-col cols="12">
        <div class="pump-header">
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
              :on-positive-click="deletePump"
              :on-negative-click="closeDeleteDialog"
            />
          </n-dialog-provider>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="pump.station"
          :counter="13"
          :error-messages="errors[index]?.station"
          label="Названия НПС"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-number-input
          v-model="pump.flow"
          :min="0"
          :reverse="false"
          control-variant="split"
          label="Расход"
          :error-messages="errors[index]?.flow"
          :hideInput="false"
          inset
        ></v-number-input>
      </v-col>
      <v-col cols="12" md="4">
        <v-number-input
          v-model="pump.length"
          :min="0"
          :reverse="false"
          control-variant="split"
          label="Длина участка, км"
          :hideInput="false"
          inset
          :error-messages="errors[index]?.length"
        ></v-number-input>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { VNumberInput } from "vuetify/labs/VNumberInput";
import DeleteDialog from "../utils/DeleteDialog.vue";

export default {
  components: {
    VNumberInput,
    DeleteDialog,
  },
  props: {
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
    };
  },
  methods: {
    confirmDelete(index) {
      this.pumpToDelete = index;
      this.isDeleteDialogVisible = true;
    },
    deletePump() {
      if (this.pumpToDelete !== null) {
        this.pumps.splice(this.pumpToDelete, 1);
        this.errors.splice(this.pumpToDelete, 1);
      }
      this.closeDeleteDialog();
    },
    closeDeleteDialog() {
      this.isDeleteDialogVisible = false;
      this.pumpToDelete = null;
    },
  },
};
</script>

<style scoped>
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
</style>
