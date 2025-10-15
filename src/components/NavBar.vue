<template>
  <nav class="nav-ancient fixed top-0 w-full text-white z-50 shadow-lg">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <i class="fas fa-book text-2xl text-accent"></i>
        <span class="text-2xl font-bold">古诗词赏析</span>
      </div>
      <div class="hidden md:flex space-x-8">
        <a href="#home" class="hover:text-accent transition-colors duration-300">首页</a>
        <a href="#poems" class="hover:text-accent transition-colors duration-300">诗词精选</a>
        <a href="#poets" class="hover:text-accent transition-colors duration-300">诗人介绍</a>
        <a href="#about" class="hover:text-accent transition-colors duration-300">关于我们</a>
        <a href="#contact" class="hover:text-accent transition-colors duration-300">联系我们</a>
      </div>
      <button class="btn-secondary border-accent text-accent hover:bg-accent">
        <i class="fas fa-search mr-2"></i>搜索诗词
      </button>
      <!-- 移动端菜单按钮 -->
      <div class="md:hidden">
        <button 
          @click="toggleMobileMenu" 
          class="text-white focus:outline-none"
          aria-label="切换菜单"
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
    <div 
      v-show="isMobileMenuOpen" 
      class="md:hidden bg-primary border-t border-accent"
    >
      <div class="px-6 py-4 space-y-4">
        <a href="#home" class="block hover:text-accent transition-colors duration-300">首页</a>
        <a href="#poems" class="block hover:text-accent transition-colors duration-300">诗词精选</a>
        <a href="#poets" class="block hover:text-accent transition-colors duration-300">诗人介绍</a>
        <a href="#about" class="block hover:text-accent transition-colors duration-300">关于我们</a>
        <a href="#contact" class="block hover:text-accent transition-colors duration-300">联系我们</a>
        <button class="w-full btn-secondary border-accent text-accent hover:bg-accent">
          <i class="fas fa-search mr-2"></i>搜索诗词
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      isMobileMenuOpen: false
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    }
  }
}
</script>

<style scoped>
/* 组件特定样式 */
</style>