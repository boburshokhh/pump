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

const pinia = createPinia();
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', 
  },
});

const app = createApp(App)

app.use(router)
app.use(NaiveUI)
app.use(vuetify)
app.use(pinia)
app.mount('#app')

import { useOptionsStore } from './stores/options';
const optionsStore = useOptionsStore();
optionsStore.loadOptions();