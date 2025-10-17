<template>
  <nav :class="['nav-ancient fixed top-0 w-full text-white z-50 shadow-lg transition-all duration-300', { 'scrolled': isScrolled }]">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <i class="fas fa-book text-2xl text-accent"></i>
        <span class="text-2xl font-bold">古诗词赏析</span>
      </div>
      <div class="hidden md:flex space-x-8">
        <router-link to="/" class="hover:text-accent transition-colors duration-300">首页</router-link>
        <a href="#poems" class="hover:text-accent transition-colors duration-300">诗词精选</a>
        <a href="#poets" class="hover:text-accent transition-colors duration-300">诗人介绍</a>
        <a href="#about" class="hover:text-accent transition-colors duration-300">关于我们</a>
        <a href="#contact" class="hover:text-accent transition-colors duration-300">联系我们</a>
      </div>
      <div class="flex items-center space-x-4">
        <button 
          class="btn-secondary border-2 border-accent text-white bg-accent/20 hover:bg-accent shadow-md hover:shadow-lg transition-all duration-300"
          @click="navigateToSearch"
        >
          <i class="fas fa-search mr-2"></i>搜索诗词
        </button>
        <button
          v-if="!isAuthenticated"
          class="btn-primary bg-accent text-white hover:bg-accent-dark"
          @click="navigateToLogin"
        >
          <i class="fas fa-sign-in-alt mr-2"></i>登录
        </button>
        <div v-else class="flex items-center space-x-3">
          <span class="text-sm text-white">{{ userEmail }}</span>
          <button
            class="btn-secondary border-2 border-white text-white bg-white/20 hover:bg-white hover:text-primary shadow-md hover:shadow-lg transition-all duration-300"
            @click="navigateToDashboard"
          >
            <i class="fas fa-user mr-2"></i>个人中心
          </button>
          <button
            class="btn-secondary border-2 border-red-400 text-white bg-red-400/20 hover:bg-red-400 hover:text-white shadow-md hover:shadow-lg transition-all duration-300"
            @click="handleLogout"
          >
            <i class="fas fa-sign-out-alt mr-2"></i>退出
          </button>
        </div>
      </div>
      <!-- 移动端菜单按钮 -->
      <div class="md:hidden">
        <button
          class="text-white focus:outline-none"
          aria-label="切换菜单"
          @click="toggleMobileMenu"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              v-if="!isMobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <div v-show="isMobileMenuOpen" class="md:hidden bg-primary border-t border-accent">
      <div class="px-6 py-4 space-y-4">
        <router-link to="/" class="block hover:text-accent transition-colors duration-300" @click="isMobileMenuOpen = false">首页</router-link>
        <a href="#poems" class="block hover:text-accent transition-colors duration-300">诗词精选</a>
        <a href="#poets" class="block hover:text-accent transition-colors duration-300">诗人介绍</a>
        <a href="#about" class="block hover:text-accent transition-colors duration-300">关于我们</a>
        <a href="#contact" class="block hover:text-accent transition-colors duration-300"
          >联系我们</a
        >
        <button 
          class="w-full btn-secondary border-2 border-accent text-white bg-accent/20 hover:bg-accent shadow-md hover:shadow-lg transition-all duration-300"
          @click="navigateToSearch"
        >
          <i class="fas fa-search mr-2"></i>搜索诗词
        </button>
        <div v-if="!isAuthenticated" class="pt-2">
          <button
            class="w-full btn-primary bg-accent text-white hover:bg-accent-dark"
            @click="navigateToLogin"
          >
            <i class="fas fa-sign-in-alt mr-2"></i>登录
          </button>
        </div>
        <div v-else class="pt-2 space-y-2">
          <div class="text-sm text-white text-center py-1">{{ userEmail }}</div>
          <button
            class="w-full btn-secondary border-2 border-white text-white bg-white/20 hover:bg-white hover:text-primary shadow-md hover:shadow-lg transition-all duration-300"
            @click="navigateToDashboard"
          >
            <i class="fas fa-user mr-2"></i>个人中心
          </button>
          <button
            class="w-full btn-secondary border-2 border-red-400 text-white bg-red-400/20 hover:bg-red-400 hover:text-white shadow-md hover:shadow-lg transition-all duration-300"
            @click="handleLogout"
          >
            <i class="fas fa-sign-out-alt mr-2"></i>退出登录
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

export default {
  name: 'NavBar',
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    return {
      userStore,
      router
    }
  },
  data() {
    return {
      isMobileMenuOpen: false,
      isScrolled: false
    }
  },
  computed: {
    isAuthenticated() {
      return this.userStore.isAuthenticated
    },
    userEmail() {
      return this.userStore.user?.email || '用户'
    }
  },
  mounted() {
    this.userStore.initUser()
    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll)
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 10
    },
    
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    navigateToLogin() {
      this.router.push('/login')
      this.isMobileMenuOpen = false
    },
    navigateToDashboard() {
      this.router.push('/dashboard')
      this.isMobileMenuOpen = false
    },
    navigateToSearch() {
      // 滚动到搜索区域
      const searchSection = document.getElementById('search')
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth' })
      } else {
        // 如果首页没有搜索区域，跳转到首页
        this.router.push('/#search')
      }
      this.isMobileMenuOpen = false
    },
    async handleLogout() {
      await this.userStore.logout()
      this.router.push('/')
      this.isMobileMenuOpen = false
    }
  }
}
</script>

<style scoped>
/* 组件特定样式 */
</style>
