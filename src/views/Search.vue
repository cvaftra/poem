<template>
  <div class="min-h-screen bg-gray-50 page-with-fixed-nav">
    <NavBar />
    
    <div class="container mx-auto px-6 py-8">
      <!-- 搜索头部 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">搜索诗词</h1>
        <p class="text-gray-600">输入关键词搜索您感兴趣的诗词</p>
        
        <!-- 搜索框 -->
        <div class="mt-6 relative">
          <div class="flex space-x-4">
            <div class="flex-1 relative">
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="输入诗词标题、作者、内容或关键词..."
                class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="handleSearchInput"
                @keyup.enter="performSearch"
              />
              <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                <i class="fas fa-search text-gray-400"></i>
              </div>
            </div>
            <button
              @click="performSearch"
              class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              搜索
            </button>
            <button
              @click="toggleAdvancedSearch"
              class="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <i class="fas fa-sliders-h mr-2"></i>高级搜索
            </button>
          </div>
          
          <!-- 搜索建议 -->
          <div v-if="showSuggestions && searchSuggestions.length > 0" class="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
            <div
              v-for="suggestion in searchSuggestions"
              :key="suggestion"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              @click="selectSuggestion(suggestion)"
            >
              {{ suggestion }}
            </div>
          </div>
        </div>
        
        <!-- 热门搜索 -->
        <div v-if="!hasSearched" class="mt-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">热门搜索</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="keyword in popularKeywords"
              :key="keyword"
              @click="searchByKeyword(keyword)"
              class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              {{ keyword }}
            </button>
          </div>
        </div>
      </div>

      <!-- 高级搜索面板 -->
      <div v-if="showAdvancedSearch" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">高级搜索</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">朝代</label>
            <select v-model="advancedCriteria.dynasty" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="all">全部朝代</option>
              <option v-for="dynasty in allDynasties" :key="dynasty" :value="dynasty">{{ dynasty }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">作者</label>
            <input
              v-model="advancedCriteria.author"
              type="text"
              placeholder="输入作者姓名"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">标签</label>
            <select v-model="advancedCriteria.tag" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">全部标签</option>
              <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-3">
          <button
            @click="resetAdvancedSearch"
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            重置
          </button>
          <button
            @click="performAdvancedSearch"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            应用筛选
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">搜索中...</p>
      </div>

      <!-- 搜索结果 -->
      <div v-else-if="hasSearched">
        <!-- 诗人搜索结果 -->
        <div v-if="poetResults.length > 0" class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">相关诗人 ({{ poetResults.length }} 位)</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="poet in poetResults"
              :key="poet.id"
              class="poet-card hover:shadow-lg transition-all duration-300 cursor-pointer"
              @click="viewPoetDetail(poet.id)"
            >
              <div class="text-center mb-3">
                <div class="w-16 h-16 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-2xl text-white"></i>
                </div>
              </div>
              <h3 class="text-lg font-semibold text-gray-800 text-center">{{ poet.name }}</h3>
              <p class="text-sm text-gray-600 text-center">{{ poet.dynasty }}</p>
              <p class="text-xs text-gray-500 text-center mt-1">{{ poet.style }}</p>
            </div>
          </div>
        </div>

        <!-- 诗词搜索结果 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">
              相关诗词 ({{ searchResults.length }} 首)
            </h2>
            <div class="text-sm text-gray-600">
              搜索关键词: "{{ lastSearchKeyword }}"
            </div>
          </div>

          <!-- 搜索结果为空 -->
          <div v-if="searchResults.length === 0 && poetResults.length === 0" class="text-center py-12">
            <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
            <p class="text-gray-600">没有找到相关的内容</p>
            <p class="text-sm text-gray-500 mt-2">请尝试使用其他关键词或调整搜索条件</p>
          </div>

          <!-- 搜索结果列表 -->
          <div v-else-if="searchResults.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="poem in searchResults"
              :key="poem.id"
              class="poem-card hover:shadow-lg transition-all duration-300"
            >
              <div class="text-center mb-4">
                <i class="fas fa-feather text-3xl text-primary"></i>
              </div>
              <h3 class="poem-title">{{ poem.title }}</h3>
              <div class="poem-content">
                <p v-for="line in poem.content.slice(0, 2)" :key="line" class="mb-2">
                  {{ line }}
                </p>
                <p class="text-gray-500">...</p>
              </div>
              <p class="poem-author">—— {{ poem.author }} · {{ poem.dynasty }}</p>
              <div class="mt-4 flex space-x-2">
                <button
                  @click="viewPoemDetail(poem)"
                  class="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                >
                  查看详情
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 随机推荐 -->
      <div v-if="!hasSearched" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">诗词推荐</h3>
        <PoemList />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePoemStore } from '../stores/poem'
import { searchService } from '../services/searchService'
import NavBar from '../components/NavBar.vue'
import PoemList from '../components/PoemList.vue'

export default {
  name: 'Search',
  components: {
    NavBar,
    PoemList
  },
  setup() {
    const router = useRouter()
    const poemStore = usePoemStore()
    
    // 搜索状态
    const searchKeyword = ref('')
    const searchResults = ref([])
    const poetResults = ref([])
    const hasSearched = ref(false)
    const lastSearchKeyword = ref('')
    const showAdvancedSearch = ref(false)
    const showSuggestions = ref(false)
    const searchSuggestions = ref([])
    const loading = ref(false)
    
    // 高级搜索条件
    const advancedCriteria = ref({
      dynasty: 'all',
      author: '',
      tag: '',
      keyword: ''
    })
    
    // 数据
    const popularKeywords = ref(searchService.getPopularKeywords())
    const allDynasties = ref([])
    const allTags = ref([])
    
    // 计算属性
    const currentSearchResults = computed(() => searchResults.value)
    
    // 方法
    const performSearch = async () => {
      if (!searchKeyword.value.trim()) {
        searchResults.value = []
        hasSearched.value = false
        return
      }
      
      lastSearchKeyword.value = searchKeyword.value
      loading.value = true
      
      try {
        // 同时搜索诗词和诗人
        const [poemResults, poetResults] = await Promise.all([
          searchService.searchPoems(searchKeyword.value),
          searchService.searchPoets(searchKeyword.value)
        ])
        
        searchResults.value = poemResults
        poetResults.value = poetResults
        hasSearched.value = true
        showSuggestions.value = false
      } catch (error) {
        console.error('搜索失败:', error)
        searchResults.value = []
        poetResults.value = []
      } finally {
        loading.value = false
      }
    }
    
    const performAdvancedSearch = async () => {
      const criteria = {
        ...advancedCriteria.value,
        keyword: searchKeyword.value
      }
      
      lastSearchKeyword.value = searchKeyword.value || '高级搜索'
      loading.value = true
      
      try {
        const results = await searchService.advancedSearch(criteria)
        searchResults.value = results
        hasSearched.value = true
      } catch (error) {
        console.error('高级搜索失败:', error)
        searchResults.value = []
      } finally {
        loading.value = false
      }
    }
    
    const handleSearchInput = () => {
      if (searchKeyword.value.trim()) {
        searchSuggestions.value = searchService.getSearchSuggestions(searchKeyword.value)
        showSuggestions.value = true
      } else {
        showSuggestions.value = false
        searchSuggestions.value = []
      }
    }
    
    const selectSuggestion = (suggestion) => {
      searchKeyword.value = suggestion
      performSearch()
    }
    
    const searchByKeyword = (keyword) => {
      searchKeyword.value = keyword
      performSearch()
    }
    
    const toggleAdvancedSearch = () => {
      showAdvancedSearch.value = !showAdvancedSearch.value
    }
    
    const resetAdvancedSearch = () => {
      advancedCriteria.value = {
        dynasty: 'all',
        author: '',
        tag: '',
        keyword: ''
      }
    }
    
    const viewPoemDetail = (poem) => {
      router.push(`/poem/${poem.id}`)
    }
    
    const viewPoetDetail = (poetId) => {
      router.push(`/poet/${poetId}`)
    }
    
    const toggleFavorite = (poemId) => {
      poemStore.toggleFavorite(poemId)
    }
    
    // 初始化
    onMounted(async () => {
      try {
        const [dynasties, tags] = await Promise.all([
          searchService.getAllDynasties(),
          searchService.getAllTags()
        ])
        allDynasties.value = dynasties
        allTags.value = tags
      } catch (error) {
        console.error('初始化失败:', error)
      }
    })
    
    return {
      searchKeyword,
      searchResults,
      poetResults,
      hasSearched,
      lastSearchKeyword,
      showAdvancedSearch,
      showSuggestions,
      searchSuggestions,
      advancedCriteria,
      popularKeywords,
      allDynasties,
      allTags,
      loading,
      performSearch,
      performAdvancedSearch,
      handleSearchInput,
      selectSuggestion,
      searchByKeyword,
      toggleAdvancedSearch,
      resetAdvancedSearch,
      viewPoemDetail,
      viewPoetDetail,
      toggleFavorite
    }
  }
}
</script>

<style scoped>
.poem-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f4e5 100%);
  border: 1px solid #e8e4c9;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.poem-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2F1B0A;
  margin-bottom: 1rem;
  text-align: center;
}

.poem-content {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #4A5568;
  margin-bottom: 1rem;
}

.poem-author {
  font-size: 0.875rem;
  color: #718096;
  font-style: italic;
  text-align: right;
}
</style>