import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import NaiveUI from 'naive-ui'
import 'vuetify/styles'
import { createPinia } from "pinia";
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'; 
import 'vuetify/styles'; 
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";



const pinia = createPinia();
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', 
  },
});

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(NaiveUI)
app.use(vuetify)
app.use(Toast); // Регистрация плагина
app.mount('#app')

import { useOptionsStore } from './stores/options';
const optionsStore = useOptionsStore();
optionsStore.loadOptions();