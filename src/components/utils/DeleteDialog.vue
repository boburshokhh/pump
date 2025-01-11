<template>
  <n-space class="display-index">
    <v-btn :icon="icon" :color="color" @click="handleClick">
      <v-icon>{{ icon }}</v-icon>
    </v-btn>
  </n-space>
</template>

<script>
import { useDialog, useMessage } from "naive-ui";
import { defineComponent } from "vue";

export default defineComponent({
  name: "CustomDialog",
  props: {
    icon: {
      type: String,
      default: "mdi-delete",
    },
    color: {
      type: String,
      default: "red",
    },
    dialogType: {
      type: String,
      default: "warning",
    },
    dialogTitle: {
      type: String,
      default: "Default Title",
    },
    dialogContent: {
      type: String,
      default: "Default Content",
    },
    positiveText: {
      type: String,
      default: "Confirm",
    },
    negativeText: {
      type: String,
      default: "Cancel",
    },
    onPositiveClick: {
      type: Function,
      required: false,
    },
    onNegativeClick: {
      type: Function,
      required: false,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const dialog = useDialog();
    const message = useMessage();

    const emitDelete = () => {
      emit("delete-clicked", props.index);
    };

    const showDialog = () => {
      dialog[props.dialogType]({
        title: props.dialogTitle,
        content: props.dialogContent,
        positiveText: props.positiveText,
        negativeText: props.negativeText,
        draggable: true,
        onPositiveClick: () => {
          if (props.onPositiveClick) {
            props.onPositiveClick();
          }
          message.success("Успешно выполнено!");
          emitDelete(); 
        },
        onNegativeClick: () => {
          if (props.onNegativeClick) {
            props.onNegativeClick();
          }
          message.error("Отрицательное действие выполнено!");
        },
      });
    };

    const handleClick = () => {
      showDialog();
    };

    return {
      handleClick,
      showDialog,
    };
  },
});
</script>

<style scoped>
.display-index{
  z-index: 9999;
}
.v-overlay{
  z-index:2000 !important;
}
body > div.v-overlay-container > div.v-overlay.v-overlay--active.v-dialog {
  z-index: 2000;
}

</style>
