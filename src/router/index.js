import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import Home from '../views/Home.vue'
import TestConnection from '../views/TestConnection.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import LoginTest from '../views/LoginTest.vue'
import Search from '../views/Search.vue'
import PoemDetail from '../views/PoemDetail.vue'
import PoetDetail from '../views/PoetDetail.vue'

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
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/Favorites.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login-test',
    name: 'LoginTest',
    component: LoginTest
  },

  {
    path: '/poem/:id',
    name: 'PoemDetail',
    component: PoemDetail
  },
  {
    path: '/poet/:id',
    name: 'PoetDetail',
    component: PoetDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 初始化用户状态
  await userStore.initUser()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
