<template>
  <div class="min-h-screen bg-gray-50 page-with-fixed-nav">
    <NavBar />
    
    <div class="container mx-auto px-6 py-8">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">我的收藏</h1>
        <p class="text-gray-600">这里展示您收藏的古诗词</p>
      </div>

      <!-- 收藏为空时的提示 -->
      <div v-if="favoritePoems.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
        <i class="fas fa-heart text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">您还没有收藏任何诗词</h3>
        <p class="text-gray-600 mb-6">在浏览诗词时点击心形图标来收藏您喜欢的作品</p>
        <button 
          class="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          @click="navigateToSearch"
        >
          <i class="fas fa-search mr-2"></i>去发现诗词
        </button>
      </div>

      <!-- 收藏列表 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="poem in favoritePoems"
          :key="poem.id"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="fas fa-book text-blue-600"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">{{ poem.title }}</h3>
              <p class="text-gray-600 text-sm">{{ poem.author }} · {{ poem.dynasty }}</p>
            </div>
          </div>
          <p class="text-gray-700 mb-4 line-clamp-3">
            {{ poem.content.join('') }}
          </p>
          <div class="flex space-x-2">
            <button
              class="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
              @click="viewPoemDetail(poem)"
            >
              阅读全文
            </button>
            <button 
              class="bg-red-100 text-red-600 py-2 px-3 rounded text-sm hover:bg-red-200"
              @click="toggleFavorite(poem.id)"
            >
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePoemStore } from '../stores/poem'
import NavBar from '../components/NavBar.vue'

export default {
  name: 'Favorites',
  components: {
    NavBar
  },
  setup() {
    const router = useRouter()
    const poemStore = usePoemStore()

    // 获取收藏的诗词
    const favoritePoems = computed(() => {
      return poemStore.getAllPoems.filter(poem => poem.favorite)
    })

    const navigateToSearch = () => {
      router.push('/')
    }

    const viewPoemDetail = (poem) => {
      const content = poem.fullContent.join('\\n')
      alert(`《${poem.title}》\\n作者：${poem.author}（${poem.dynasty}）\\n\\n${content}\\n\\n${poem.analysis}`)
    }

    const toggleFavorite = (poemId) => {
      poemStore.toggleFavorite(poemId)
    }

    return {
      favoritePoems,
      navigateToSearch,
      viewPoemDetail,
      toggleFavorite
    }
  }
}
</script>
