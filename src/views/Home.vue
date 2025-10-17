<template>
  <div class="min-h-screen">
    <NavBar />
    <!-- HeroSection已经有pt-20处理导航栏间距 -->
    <HeroSection />
    
    <!-- 搜索区域 -->
    <section id="search" class="py-16 bg-white bg-opacity-90">
      <div class="container mx-auto px-6">
        <div class="text-center mb-8">
          <h2 class="text-3xl md:text-4xl font-bold text-dark mb-4">搜索诗词</h2>
          <p class="text-lg text-gray-600">输入关键词搜索您感兴趣的诗词</p>
        </div>
        
        <!-- 搜索框 -->
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="输入诗词标题、作者或内容..." 
              class="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-accent transition-colors duration-300"
              @keyup.enter="performSearch"
            />
            <button 
              class="absolute right-2 top-2 bg-accent text-white p-3 rounded-full hover:bg-accent-dark transition-colors duration-300"
              @click="performSearch"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- 搜索结果 -->
        <div v-if="searchResults.length > 0" class="mt-12">
          <h3 class="text-2xl font-bold text-dark mb-6">搜索结果 ({{ searchResults.length }})</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="poem in searchResults" :key="poem.id" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <h4 class="text-xl font-semibold text-dark mb-2">{{ poem.title }}</h4>
              <p class="text-gray-600 mb-2">{{ poem.author }} · {{ poem.dynasty }}</p>
              <div class="text-gray-700 mb-4">
                <p v-for="(line, index) in poem.content.slice(0, 2)" :key="index" class="mb-1">{{ line }}</p>
              </div>
              <button 
                class="btn-primary w-full"
                @click="viewPoemDetail(poem)"
              >
                <i class="fas fa-eye mr-2"></i>查看详情
              </button>
            </div>
          </div>
        </div>

        <!-- 无结果提示 -->
        <div v-else-if="searchQuery && searchPerformed" class="mt-12 text-center">
          <p class="text-gray-600 text-lg">没有找到相关的诗词，请尝试其他关键词</p>
        </div>

        <!-- 搜索功能说明 -->
        <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-accent text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-book text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">丰富的诗词库</h3>
            <p class="text-gray-600">收录历代经典诗词，涵盖唐诗宋词元曲</p>
          </div>
          <div class="text-center">
            <div class="bg-accent text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-search text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">智能搜索</h3>
            <p class="text-gray-600">支持标题、作者、内容、朝代等多维度搜索</p>
          </div>
          <div class="text-center">
            <div class="bg-accent text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-heart text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">个性化收藏</h3>
            <p class="text-gray-600">登录后可收藏喜欢的诗词，随时查看</p>
          </div>
        </div>
      </div>
    </section>

    <PoemList />
    <PoetIntroduction />
    <AppFooter />
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import HeroSection from '../components/HeroSection.vue'
import PoemList from '../components/PoemList.vue'
import PoetIntroduction from '../components/PoetIntroduction.vue'
import AppFooter from '../components/AppFooter.vue'
import { searchService } from '../services/searchService.js'
import { useRouter } from 'vue-router'

export default {
  name: 'Home',
  components: {
    NavBar,
    HeroSection,
    PoemList,
    PoetIntroduction,
    AppFooter
  },
  setup() {
    const router = useRouter()
    
    return {
      router
    }
  },
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      searchPerformed: false
    }
  },
  methods: {
    async performSearch() {
      if (this.searchQuery.trim()) {
        this.searchResults = await searchService.searchPoems(this.searchQuery)
        this.searchPerformed = true
      } else {
        this.searchResults = []
        this.searchPerformed = false
      }
    },
    viewPoemDetail(poem) {
      this.router.push(`/poem/${poem.id}`)
    }
  }
}
</script>

<style scoped>
/* 页面特定样式 */
</style>
