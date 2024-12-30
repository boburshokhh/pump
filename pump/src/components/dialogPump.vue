<template>
  <n-flex :margin="16" justify="end">
    <v-btn class="ma-3" variant="tonal" color="primary"  :ripple="true" @click="openDrawer">
      Изменить параметры схемы
    </v-btn>
  </n-flex>
  <n-drawer v-model:show="localShow" :width="502" :placement="placement">
    <n-drawer-content>
      <formAddPump />
    </n-drawer-content>
  </n-drawer>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import formAddPump from "./formAddPump.vue";

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
