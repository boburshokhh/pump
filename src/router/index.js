import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'
import NotFound from '../components/layouts/NotFound.vue'
import UserGuide from '../components/features/UserGuide.vue';

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
  {
    path: '/guide',
    name: 'Guide',
    component: UserGuide
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
