<script>
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from "vue";
import formAddPump from "../base/BaseForm.vue";
import { useCalculationsStore } from "../../stores/calculations";
import ResultCalc from "./ResultCalc.vue";
import Notification from "../utils/Notification.vue";

export default defineComponent({
  components: {
    formAddPump,
    ResultCalc,
    Notification,
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
    console.log("calculationsStore:",calculationsStore);  
    const showResults = ref(false);

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
      const isValid = calculationsStore.pumpResults.consumptionStation.every(value => value >= 0);

      console.log("isValid:",isValid,"pumpResults:",calculationsStore.pumpResults);
      calculationsStore.setCalculateClicked(true);
      calculationsStore.updateCalculations();
      showResults.value = true;
    };

    return {
      localShow,
      placement: "right",
      drawerWidth,
      isMobile,
      openDrawer,
      closeDrawer,
      showResults,
      handleCalculate,
    };
  },
});
</script>

<template>
  <n-flex :margin="16" justify="space-between">
    <div class="button-group">
      <v-btn
        class="ma-3"
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

      <ResultCalc v-if="showResults"/>
    </div>

    <v-btn
      class="ma-3"
      variant="tonal"
      color="primary"
      :ripple="true"
      @click="openDrawer"
    >
      <v-icon icon="mdi-plus" start size="25"></v-icon>
      Добавить
      <v-tooltip activator="parent" location="start"> Добавить НПС </v-tooltip>
    </v-btn>
  </n-flex>

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
  margin:  0;
  z-index: 2;
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
}

:deep(.n-drawer-content) {
  padding: 16px;
}

:deep(.n-drawer-content-wrapper) {
  height: 100%;
}
</style>
