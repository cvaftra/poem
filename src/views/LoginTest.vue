<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">登录功能测试</h1>
        <p class="mt-2 text-gray-600">测试登录功能与数据库用户表的连接</p>
      </div>

      <!-- 数据库连接状态 -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">数据库连接状态</h2>
        <div class="flex items-center justify-between">
          <span class="text-gray-700">Supabase连接:</span>
          <span :class="dbStatus ? 'text-green-600' : 'text-red-600'" class="font-medium">
            {{ dbStatus ? '已连接' : '未连接' }}
          </span>
        </div>
        <div class="mt-2">
          <button 
            @click="testDatabaseConnection"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            :disabled="testingDb"
          >
            {{ testingDb ? '测试中...' : '测试连接' }}
          </button>
        </div>
      </div>

      <!-- 用户认证状态 -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">用户认证状态</h2>
        <div v-if="userStore.isAuthenticated && userStore.userProfile">
          <div class="space-y-2">
            <div><strong>用户名:</strong> {{ userStore.userProfile.username }}</div>
            <div><strong>邮箱:</strong> {{ userStore.user.email }}</div>
            <div><strong>角色:</strong> {{ userStore.userProfile.role }}</div>
            <div><strong>最后登录:</strong> {{ formatDate(userStore.userProfile.last_login_at) }}</div>
          </div>
          <button 
            @click="logout"
            class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            退出登录
          </button>
        </div>
        <div v-else>
          <p class="text-gray-600">未登录</p>
          <button 
            @click="showLoginModal = true"
            class="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            点击登录
          </button>
        </div>
      </div>

      <!-- 登录模态框 -->
      <LoginModal 
        v-if="showLoginModal"
        @close="showLoginModal = false"
        @success="handleLoginSuccess"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import LoginModal from '../components/LoginModal.vue'
import { databaseInit } from '../utils/databaseInit'

export default {
  name: 'LoginTest',
  components: {
    LoginModal
  },
  setup() {
    const userStore = useUserStore()
    const showLoginModal = ref(false)
    const dbStatus = ref(false)
    const testingDb = ref(false)

    // 测试数据库连接
    const testDatabaseConnection = async () => {
      testingDb.value = true
      try {
        const success = await databaseInit.testDatabase()
        dbStatus.value = success
      } catch (error) {
        console.error('数据库测试失败:', error)
        dbStatus.value = false
      } finally {
        testingDb.value = false
      }
    }

    // 处理登录成功
    const handleLoginSuccess = () => {
      console.log('登录成功')
      showLoginModal.value = false
    }

    // 退出登录
    const logout = async () => {
      await userStore.logout()
    }

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '从未登录'
      return new Date(dateString).toLocaleString('zh-CN')
    }

    // 初始化
    onMounted(async () => {
      await userStore.initUser()
      await testDatabaseConnection()
    })

    return {
      userStore,
      showLoginModal,
      dbStatus,
      testingDb,
      testDatabaseConnection,
      handleLoginSuccess,
      logout,
      formatDate
    }
  }
}
</script>