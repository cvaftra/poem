import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import TestConnection from '../views/TestConnection.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/test-connection',
    name: 'TestConnection',
    component: TestConnection
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router