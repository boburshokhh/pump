<template>
  <v-dialog
    activator="parent"
    @update:modelValue="handleDialogClose"
    v-model="isOpen"
    :max-width="$vuetify.display.mdAndDown ? '95%' : '700px'"
    transition="dialog-bottom-transition"
  >
    <template v-slot:default>
      <v-card rounded="lg" class="pump-info-card" elevation="8">
        <v-card-title class="d-flex justify-space-between align-center pa-4">
          <div class="text-h6 font-weight-medium primary--text">
            Параметры насоса
          </div>
          <v-btn 
            icon="mdi-close" 
            variant="text" 
            @click="close"
            class="close-btn"
            color="grey"
          ></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-4">
          <div class="table-wrapper">
            <table class="vertical-table">
              <tbody>
                <tr v-for="(column, index) in columns" 
                    :key="index"
                    class="table-row"
                >
                  <th class="label-cell">{{ column.title }}</th>
                  <td class="value-cell">{{ tableData[0]?.[column.key] || "—" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4 d-flex justify-end">
          <v-btn 
            class="close-button" 
            color="primary"
            variant="tonal" 
            rounded="xl" 
            @click="close"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import { useOptionsStore } from "../../stores/options";
export default {
  props: {
    parameters: {
      type: [Object, Number],
      required: false,
    },
  },
  data() {
    return {
      tableData: [],
      isOpen: false,
      pumpData: null,
      columns: [
        { title: "Название", key: "name" },
        { title: "Тип", key: "type" },
        {
          title: "Макс. производительность, м³/ч",
          key: "max_capacity_m3_per_hour",
        },
        {
          title: "Мин. производительность, м³/ч",
          key: "min_capacity_m3_per_hour",
        },
        { title: "Макс. обороты, об/мин", key: "max_rpm" },
        { title: "Мин. обороты, об/мин", key: "min_rpm" },
        { title: "КПД, %", key: "efficiency_percent" },
        { title: "a, м", key: "a_approc" },
        { title: "b, м/(м³/ч)²", key: "b_approc" }, // Исправлено
      ],
    };
  },
  created() {
    const pump = useOptionsStore().findOptionById(this.parameters);
    console.log(pump);
    this.tableData.push(pump);
  },
  methods: {
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
      this.$emit("close"); // Сообщаем о закрытии
    },
    handleDialogClose(value) {
      if (!value) {
        this.close();
      }
    },
  },
};
</script>

<style scoped>
.pump-info-card {
  transition: all 0.3s ease;
  overflow: hidden;
}

.table-wrapper {
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow-x: auto;
}

.vertical-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.label-cell {
  text-align: left;
  font-weight: 600;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border: 1px solid #e9ecef;
  color: #2c3e50;
  white-space: nowrap;
  min-width: 200px;
}

.value-cell {
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  color: #34495e;
}

.close-btn {
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: rotate(90deg);
}

.close-button {
  transition: all 0.2s ease;
}

.close-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .label-cell,
  .value-cell {
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .label-cell {
    min-width: 160px;
  }
}

@media (max-width: 480px) {
  .label-cell,
  .value-cell {
    padding: 6px 10px;
    font-size: 0.85rem;
  }

  .label-cell {
    min-width: 140px;
  }
}
</style>
