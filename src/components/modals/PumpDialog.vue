<template>
  <n-flex :margin="16" justify="end">
    <v-btn
      class="ma-3"
      variant="tonal"
      color="primary"
      :ripple="true"
      @click="openDrawer"
      >
      <v-icon
      icon="mdi-plus"
      start
      size="25"
    ></v-icon>
    
    Добавить
      <v-tooltip activator="parent" location="start"
        >Изменить параметры схемы</v-tooltip
      >
    </v-btn>
  </n-flex>
  <n-drawer v-model:show="localShow" :width="700" :placement="placement">
    <n-drawer-content>
      <formAddPump />
    </n-drawer-content>
  </n-drawer>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
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
      openDrawer,
      closeDrawer,
    };
  },
});
</script>
