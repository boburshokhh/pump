// stores/notificationStore.js
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notify: null, // будет хранить функцию для показа уведомлений
  }),
  actions: {
    setNotifyFunction(notifyFunction) {
      this.notify = notifyFunction;
    },
    showNotification(options) {
      if (this.notify) {
        this.notify(options);
      }
    },
  },
});
