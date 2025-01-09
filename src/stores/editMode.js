import { defineStore } from 'pinia';

export const useEditModeStore = defineStore('editMode', {
  state: () => ({
    isEditMode: false, 
  }),
  actions: {
    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    },
    enableEditMode() {
      this.isEditMode = true;
    },
    disableEditMode() {
      this.isEditMode = false;
    },
  },
});
