<template>
  <div>
    <n-notification-provider>
      <n-button @click="triggerNotification">Show Notification</n-button>
    </n-notification-provider>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useNotification } from "naive-ui";

export default defineComponent({
  name: "CustomNotification",
  props: {
    title: {
      type: String,
      default: "Notification Title",
    },
    description: {
      type: String,
      default: "This is the default description",
    },
    duration: {
      type: Number,
      default: 3000, // milliseconds
    },
    type: {
      type: String,
      default: "info", // success, error, warning, info
      validator: (value) => ["success", "error", "warning", "info"].includes(value),
    },
    asyncHandler: {
      type: Function,
      default: null,
    },
  },
  emits: ["trigger"],
  setup(props, { emit }) {
    const notification = useNotification();

    const triggerNotification = async () => {
      emit("trigger");
      if (props.asyncHandler) {
        await props.asyncHandler();
      }

      notification[props.type]({
        title: props.title,
        content: props.description,
        duration: props.duration,
      });
    };

    return {
      triggerNotification,
    };
  },
});
</script>

<style scoped>
/* Add any necessary custom styles */
</style>
