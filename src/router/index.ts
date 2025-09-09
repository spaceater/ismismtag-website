import { createRouter, createWebHistory } from 'vue-router'
import ismismcube from '../pages/ismismcube/ismismcube.vue'
import NotFound from '../pages/404/404.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ismismcube
    },
    {
      path: '/:ismTag([1-4]|[1-4]-[1-4]|[1-4]-[1-4]-[1-4]|[1-4]-[1-4]-[1-4]-[1-4])',
      name: 'ismDetail',
      component: ismismcube
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFound
    }
  ]
})

export default router
