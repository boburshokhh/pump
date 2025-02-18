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
      timeout: 3000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: "button",
      icon: true,
      rtl: false,
      position: "top-right",
      containerClassName: "toast-container",
      toastClassName: "toast",
      zIndex: 10000,
      ...options, 
    });

    const showNotification = (textOptions = {}, options = {}) => {
      const finalOptions = getDefaultOptions(options);

      if (!textOptions.title || !textOptions.message) {
        console.error("Уведомление должно содержать 'title' и 'message'.");
        return;
      }

      toast(
        {
          component: textNotification, 
          props: {
            title: textOptions.title, 
            message: textOptions.message,
            titleClass: textOptions.titleClass || "text-h5",
            messageClass: textOptions.messageClass || "text-body-2",
          },
        },
        finalOptions 
      );
    };

    expose({
      showNotification,
    });

    return {
      showNotification,
    };
  },
});
</script>
