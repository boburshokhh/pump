import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './stores'
import NaiveUI from 'naive-ui'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(NaiveUI)

app.mount('#app')
