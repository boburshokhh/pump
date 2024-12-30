import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import formAddPump from '../components/formAddPump.vue';
import dialogPump from '../components/dialogPump.vue'
import naiveTable2 from '../components/naiveTable2.vue'
import chartPump from '../components/chartPump.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App,
  },
  {
    path: '/add-pump',
    name: 'AddPumpForm',
    component: dialogPump,
  },
  {
    path: '/menu',
    name: 'Menu',
    components: {
      chartPump: chartPump, // Дополнительный слот
      naiveTable2: naiveTable2, // Еще один дополнительный слот
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
