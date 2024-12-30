import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './stores'
import NaiveUI from 'naive-ui'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'; 
import 'vuetify/styles'; 


const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', 
  },
});

const app = createApp(App)

app.use(router)
app.use(store)
app.use(NaiveUI)
app.use(vuetify)
app.mount('#app')
