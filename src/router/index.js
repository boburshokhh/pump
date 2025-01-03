import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import BaseTable from '../components/base/BaseTable.vue';
import PumpChart from '../components/features/PumpChart.vue';
import NotFound from '../components/layouts/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App,
  },
  {
    path: '/:pathMatch(.*)*', 
    name: 'NotFound',
    component: NotFound, 
  },
  {
    path: '/menu',
    name: 'Menu',
    components: {
      chartPump: PumpChart, 
      naiveTable2: BaseTable, 
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
