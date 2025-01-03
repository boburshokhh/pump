import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import HomeView from '../views/HomeView.vue'
import NotFound from '../components/layouts/NotFound.vue'

const routes = [
  {
    path: '/:pathMatch(.*)*', 
    name: 'NotFound',
    component: NotFound, 
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
