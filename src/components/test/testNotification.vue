<template>
  <div />
</template>

<script>
import { defineComponent } from "vue";
import { useToast } from "vue-toastification";
import textNotification from "./textNotification.vue";

export default defineComponent({
  name: "NotificationSystem",
  setup(_, { expose }) {
    const toast = useToast();

    const getDefaultOptions = (options) => ({
      component: textNotification,
      ...options,
    });

    const showNotification = (textOptions = {}, options = {}) => {
      toast(getDefaultOptions({
        props: { ...textOptions },
        ...options,
      }));
    };

    expose({
      showNotification,
    });

    return {};
  },
});
</script>
