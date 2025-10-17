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

        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">加载中...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-500 text-6xl mb-4">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <p class="text-gray-600">{{ error }}</p>
          <button 
            @click="$router.push('/')"
            class="mt-4 btn-primary"
          >
            返回首页
          </button>
        </div>

        <!-- 诗人详情内容 -->
        <div v-else class="text-center mb-8">
          <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
            <i class="fas fa-user text-6xl text-white"></i>
          </div>
          <h1 class="text-4xl font-bold text-gray-800 mb-2">{{ poet.name }}</h1>
          <p class="text-xl text-gray-600 mb-4">{{ poet.dynasty_name }}</p>
          <p class="text-lg text-gray-500">{{ poet.honorific_title || poet.style }}</p>
        </div>

        <!-- 诗人简介 -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">诗人简介</h2>
          <div class="bg-gray-50 p-6 rounded-lg">
            <p class="text-gray-700 leading-relaxed">{{ poet.introduction }}</p>
          </div>
        </div>

        <!-- 代表作品 -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">代表作品</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="work in representativeWorks" 
              :key="work.id"
              class="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
              @click="viewPoemDetail(work)"
            >
              <h3 class="font-semibold text-gray-800">{{ work.title }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ work.content[0] }}</p>
            </div>
          </div>
        </div>

        <!-- 诗人信息 -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">详细信息</h2>
          <div class="bg-green-50 p-6 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-gray-700"><strong>字号：</strong>{{ poet.pseudonym || '无' }}</p>
                <p class="text-gray-700"><strong>生卒年份：</strong>{{ poet.birth_year || '未知' }} - {{ poet.death_year || '未知' }}</p>
                <p class="text-gray-700"><strong>出生地：</strong>{{ poet.birthplace || '未知' }}</p>
              </div>
              <div>
                <p class="text-gray-700"><strong>风格：</strong>{{ poet.style || '未知' }}</p>
                <p class="text-gray-700"><strong>尊称：</strong>{{ poet.honorific_title || '无' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 相关诗人 -->
        <div v-if="relatedPoets.length > 0" class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">同时代诗人</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              v-for="relatedPoet in relatedPoets" 
              :key="relatedPoet.id"
              class="bg-gray-100 p-4 rounded-lg text-center hover:bg-gray-200 transition-colors cursor-pointer"
              @click="viewPoetDetail(relatedPoet.id)"
            >
              <div class="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-white"></i>
              </div>
              <h3 class="font-semibold text-gray-800">{{ relatedPoet.name }}</h3>
              <p class="text-sm text-gray-600">{{ relatedPoet.dynasty_name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemStore } from '../stores/poem'
import { poetService } from '../services/poetService'
import { supabase } from '../lib/supabaseClient'
import NavBar from '../components/NavBar.vue'

export default {
  name: 'PoetDetail',
  components: {
    NavBar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const poemStore = usePoemStore()
    
    const poet = ref({})
    const poetId = ref(parseInt(route.params.id))
    const loading = ref(true)
    const error = ref(null)

    onMounted(async () => {
      try {
        loading.value = true
        const poetData = await poetService.getPoetById(poetId.value)
        
        if (poetData) {
          // 获取朝代名称
          const { data: dynastyData, error: dynastyError } = await supabase
            .from('dynasties')
            .select('name')
            .eq('id', poetData.dynasty_id)
            .single()
          
          if (!dynastyError && dynastyData) {
            poetData.dynasty_name = dynastyData.name
          }
          
          poet.value = poetData
        } else {
          error.value = '诗人不存在'
          router.push('/')
        }
      } catch (err) {
        console.error('获取诗人详情失败:', err)
        error.value = '获取诗人详情失败，请稍后重试'
      } finally {
        loading.value = false
      }
    })

    // 获取诗人的代表作品
    const representativeWorks = computed(() => {
      return poemStore.getAllPoems.filter(poem => 
        poem.author === poet.value.name
      ).slice(0, 4)
    })

    // 获取相关诗人（同时代的其他诗人）
    const relatedPoets = ref([])

    const loadRelatedPoets = async () => {
      if (!poet.value.dynasty_name) return
      
      try {
        const poets = await poetService.getPoetsByDynasty(poet.value.dynasty_name)
        relatedPoets.value = poets.filter(p => p.id !== poet.value.id).slice(0, 3)
        
        // 为相关诗人添加朝代名称
        for (let relatedPoet of relatedPoets.value) {
          const { data: dynastyData, error: dynastyError } = await supabase
            .from('dynasties')
            .select('name')
            .eq('id', relatedPoet.dynasty_id)
            .single()
          
          if (!dynastyError && dynastyData) {
            relatedPoet.dynasty_name = dynastyData.name
          }
        }
      } catch (err) {
        console.error('获取相关诗人失败:', err)
        relatedPoets.value = []
      }
    }

    // 监听诗人数据变化，加载相关诗人
    watch(() => poet.value, (newPoet) => {
      if (newPoet && newPoet.dynasty_name) {
        loadRelatedPoets()
      }
    }, { immediate: true })

    const viewPoemDetail = (poem) => {
      router.push(`/poem/${poem.id}`)
    }

    const viewPoetDetail = (id) => {
      router.push(`/poet/${id}`)
    }

    return {
      poet,
      loading,
      error,
      representativeWorks,
      relatedPoets,
      viewPoemDetail,
      viewPoetDetail
    }
  }
}
</script>

<style scoped>
/* 组件特定样式 */
</style>