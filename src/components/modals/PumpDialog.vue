<script>
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from "vue";
import formAddPump from "../base/BaseForm.vue";
import { useCalculationsStore } from "../../stores/calculations";
import ResultCalc from "./ResultCalc.vue";
import Notification from "../utils/Notification.vue";
import TableElevationMarks from "../forms/coordinatsInterpolation.vue"
import CoordinatsInterpolation from '../forms/coordinatsInterpolation.vue'

export default defineComponent({
  components: {
    formAddPump,
    ResultCalc,
    Notification,
    TableElevationMarks,
    CoordinatsInterpolation
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:show"],
  setup(props, { emit }) {
    const localShow = ref(props.show);
    const drawerWidth = ref("700px");
    const isMobile = ref(false);
    const calculationsStore = useCalculationsStore();
    const showResults = ref(false);
    const showCoordinatesModal = ref(false);

    const updateDrawerWidth = () => {
      const screenWidth = window.innerWidth;
      isMobile.value = screenWidth < 768;
      if (isMobile.value) {
        drawerWidth.value = "100%";
      } else if (screenWidth < 1024) {
        drawerWidth.value = "80%";
      } else {
        drawerWidth.value = "700px";
      }
    };

    onMounted(() => {
      updateDrawerWidth();
      window.addEventListener("resize", updateDrawerWidth);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateDrawerWidth);
    });

    watch(
      () => props.show,
      (newValue) => {
        localShow.value = newValue;
      }
    );

    watch(localShow, (newValue) => {
      emit("update:show", newValue);
    });

    const openDrawer = () => {
      localShow.value = true;
    };

    const closeDrawer = () => {
      localShow.value = false;
    };

    const handleCalculate = () => {
      calculationsStore.setCalculateClicked(true);
      calculationsStore.updateCalculations();
      showResults.value = true;
    };

    const handleCoordinatesSave = (data) => {
      console.log('Сохраненные координаты:', data)
      showCoordinatesModal.value = false
    }

    return {
      localShow,
      placement: "right",
      drawerWidth,
      isMobile,
      openDrawer,
      closeDrawer,
      showResults,
      handleCalculate,
      showCoordinatesModal,
      handleCoordinatesSave
    };
  },
});
</script>

<template>
  <div class="d-flex flex-column flex-sm-row justify-space-between align-center pa-4">
    <!-- Левая группа кнопок -->
    <div class="button-group left-buttons">
      <v-btn
        class="ma-2"
        variant="tonal"
        color="success"
        :ripple="true"
        @click="handleCalculate"
      >
        <v-icon icon="mdi-calculator" start size="25"></v-icon>
        Рассчитать
        <v-tooltip activator="parent" location="start">
          Нажмите, чтобы выполнить расчет
        </v-tooltip>
      </v-btn>

      <ResultCalc v-if="showResults" class="ma-2" />
    </div>

    <!-- Правая группа кнопок -->
    <div class="button-group right-buttons">
      <v-btn
        class="ma-2"
        variant="tonal"
        color="info"
        :ripple="true"
        @click="showCoordinatesModal = true"
      >
        <v-icon icon="mdi-map-marker-path" start size="25"></v-icon>
        Координаты
        <v-tooltip activator="parent" location="start">
          Настройка координат и высот
        </v-tooltip>
      </v-btn>

      <v-btn
        class="ma-2"
        variant="tonal"
        color="primary"
        :ripple="true"
        @click="openDrawer"
      >
        <v-icon icon="mdi-plus" start size="25"></v-icon>
        Добавить
        <v-tooltip activator="parent" location="start">
          Добавить НПС
        </v-tooltip>
      </v-btn>
    </div>
  </div>

  <!-- Coordinates Modal -->
  <CoordinatsInterpolation 
    :model-value="showCoordinatesModal"
    @update:model-value="showCoordinatesModal = $event"
    @save="handleCoordinatesSave"
  />

  <n-drawer
    v-model:show="localShow"
    :width="drawerWidth"
    :placement="placement"
  >
    <n-drawer-content>
      <div class="dialog-header">
        <h3 class="dialog-title">Параметры НПС</h3>
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          class="close-btn"
          @click="closeDrawer"
        ></v-btn>
      </div>
      <div class="mt-4"></div>
      <v-divider></v-divider>
      <div class="mt-4"></div>
      <v-divider></v-divider>

      <div class="dialog-content">
        <formAddPump @close="closeDrawer" />
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<style>
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background-color: #fff;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  margin: 0;
  z-index: 5;
}

.dialog-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.65);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-btn:hover {
  color: rgba(0, 0, 0, 0.85);
  background-color: rgba(0, 0, 0, 0.04);
}

.close-btn:active {
  background-color: rgba(0, 0, 0, 0.08);
}

.dialog-content {
  margin: 0 -16px;
  padding: 16px;
}

.button-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.left-buttons {
  flex-wrap: nowrap;
}

.right-buttons {
  flex-wrap: nowrap;
}

@media (max-width: 600px) {
  .d-flex {
    flex-direction: column;
    width: 100%;
  }

  .button-group {
    width: 100%;
  }

  .left-buttons, .right-buttons {
    flex-direction: column;
    width: 100%;
  }

  .button-group .v-btn {
    width: 100%;
  }

  .ma-2 {
    margin: 4px 0 !important;
  }
}

:deep(.n-drawer-content) {
  padding: 16px;
}

:deep(.n-drawer-content-wrapper) {
  height: 100%;
}
</style>
