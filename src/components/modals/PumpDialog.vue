<script>
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from "vue";
import formAddPump from "../base/BaseForm.vue";

export default defineComponent({
  components: {
    formAddPump,
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

    return {
      localShow,
      placement: "right",
      drawerWidth,
      isMobile,
      openDrawer,
      closeDrawer,
    };
  },
});
</script>

<template>
  <n-flex :margin="16" justify="end">
    <v-btn
      class="ma-3"
      variant="tonal"
      color="primary"
      :ripple="true"
      @click="openDrawer"
    >
      <v-icon icon="mdi-plus" start size="25"></v-icon>
      Добавить
      <v-tooltip activator="parent" location="start">
        Изменить параметры схемы
      </v-tooltip>
    </v-btn>
  </n-flex>
  <n-drawer v-model:show="localShow" :width="drawerWidth" :placement="placement">
    <n-drawer-content>
      <div v-if="isMobile" class="mobile-close">
        <v-btn
          icon
          @click="closeDrawer"
          class="close-btn"
        >
          <v-icon icon="mdi-close" size="25"></v-icon>
        </v-btn>
      </div>
      <formAddPump />
    </n-drawer-content>
  </n-drawer>
</template>

<style>
.mobile-close {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
}

.close-btn {
  color: var(--v-primary-base); 
}
</style>
