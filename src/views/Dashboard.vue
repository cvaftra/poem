<template>
  <div class="min-h-screen bg-gray-50 page-with-fixed-nav">
    <NavBar />
    
    <div class="container mx-auto px-6 py-8">
      <!-- 用户信息卡片 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="fas fa-user text-blue-600 text-2xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800">欢迎回来，{{ userEmail }}</h1>
            <p class="text-gray-600">这是您的个人仪表板</p>
          </div>
        </div>
      </div>

      <!-- 功能卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 我的收藏 -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <i class="fas fa-heart text-green-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">我的收藏</h3>
          </div>
          <p class="text-gray-600 mb-4">查看您收藏的古诗词</p>
          <button
            class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            @click="navigateToFavorites"
          >
            查看收藏
          </button>
        </div>

        <!-- 阅读历史 -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <i class="fas fa-history text-purple-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">阅读历史</h3>
          </div>
          <p class="text-gray-600 mb-4">查看您最近阅读的诗词</p>
          <button
            class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
            @click="navigateToHistory"
          >
            查看历史
          </button>
        </div>

        <!-- 个人设置 -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <i class="fas fa-cog text-yellow-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">个人设置</h3>
          </div>
          <p class="text-gray-600 mb-4">管理您的账户设置</p>
          <button
            class="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
            @click="navigateToSettings"
          >
            账户设置
          </button>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import NavBar from '../components/NavBar.vue'

export default {
  name: 'Dashboard',
  components: {
    NavBar
  },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const userEmail = computed(() => userStore.user?.email || '用户')

    const navigateToFavorites = () => {
      router.push('/favorites')
    }

    const navigateToHistory = () => {
      // 暂时重定向到首页
      router.push('/')
    }

    const navigateToSettings = () => {
      router.push('/settings')
    }

    const navigateToPoems = () => {
      router.push('/')
    }

    const navigateToPoets = () => {
      router.push('/#poets')
    }

    const navigateToSearch = () => {
      router.push('/#search')
    }

    const handleLogout = async () => {
      await userStore.logout()
      router.push('/')
    }

    return {
      userEmail,
      navigateToFavorites,
      navigateToHistory,
      navigateToSettings,
      navigateToPoems,
      navigateToPoets,
      navigateToSearch,
      handleLogout
    }
  }
}
</script>
