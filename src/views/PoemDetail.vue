<template>
  <div class="min-h-screen bg-gray-50 page-with-fixed-nav">
    <NavBar />
    
    <div class="container mx-auto px-6 py-8">
      <div class="bg-white rounded-lg shadow-md p-8">
        <!-- 返回按钮 -->
        <button 
          @click="$router.back()"
          class="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <i class="fas fa-arrow-left mr-2"></i>返回
        </button>

        <!-- 诗词详情内容 -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">{{ poem.title }}</h1>
          <p class="text-xl text-gray-600">{{ poem.author }} · {{ poem.dynasty }}</p>
        </div>

        <!-- 诗词内容 -->
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-r-lg">
          <div class="text-center">
            <div v-for="line in poem.fullContent" :key="line" class="text-2xl leading-loose mb-2">
              {{ line }}
            </div>
          </div>
        </div>

        <!-- 诗词赏析 -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">诗词赏析</h2>
          <div class="bg-gray-50 p-6 rounded-lg">
            <p class="text-gray-700 leading-relaxed">{{ poem.analysis }}</p>
          </div>
        </div>

        <!-- 标签 -->
        <div v-if="poem.tags && poem.tags.length > 0" class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">标签</h2>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in poem.tags" 
              :key="tag"
              class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-center space-x-4">
          <button
            @click="toggleFavorite"
            :class="[
              'px-6 py-3 rounded-lg font-semibold transition-colors',
              poem.favorite 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            <i class="fas fa-heart mr-2"></i>
            {{ poem.favorite ? '取消收藏' : '收藏诗词' }}
          </button>
          <button
            @click="sharePoem"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i class="fas fa-share mr-2"></i>分享
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemStore } from '../stores/poem'
import NavBar from '../components/NavBar.vue'

export default {
  name: 'PoemDetail',
  components: {
    NavBar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const poemStore = usePoemStore()
    
    const poem = ref({})
    const poemId = ref(parseInt(route.params.id))

    onMounted(() => {
      const foundPoem = poemStore.getPoemById(poemId.value)
      if (foundPoem) {
        poem.value = foundPoem
      } else {
        // 如果找不到诗词，跳转回首页
        router.push('/')
      }
    })

    const toggleFavorite = () => {
      poemStore.toggleFavorite(poemId.value)
      poem.value.favorite = !poem.value.favorite
    }

    const sharePoem = () => {
      if (navigator.share) {
        navigator.share({
          title: poem.value.title,
          text: `${poem.value.title} - ${poem.value.author}`,
          url: window.location.href
        })
      } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href)
        alert('链接已复制到剪贴板！')
      }
    }

    return {
      poem,
      toggleFavorite,
      sharePoem
    }
  }
}
</script>

<style scoped>
/* 组件特定样式 */
</style>