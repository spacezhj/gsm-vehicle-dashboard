import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/dispatch',
    name: 'Dispatch',
    component: () => import('@/views/DispatchView.vue')
  },
  {
    path: '/multi-vehicle',
    name: 'MultiVehicle',
    component: () => import('@/views/MultiVehicleView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
