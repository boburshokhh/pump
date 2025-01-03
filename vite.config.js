import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
  base: "/pump-project",
  plugins: [
    vue(),
    vuetify({
      autoImport: true, // Включаем автоимпорт компонентов Vuetify
    }),
  ],
});
