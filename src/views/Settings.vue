<template>
  <div class="min-h-screen bg-gray-50 page-with-fixed-nav">
    <NavBar />
    
    <div class="container mx-auto px-6 py-8">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">账户设置</h1>
        <p class="text-gray-600">管理您的个人信息和偏好设置</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 个人信息 -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">个人信息</h2>
          <form class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="请输入用户名"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                  :value="userEmail"
                  disabled
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
              <textarea
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
                placeholder="请输入个人简介"
              ></textarea>
            </div>
            <button
              type="submit"
              class="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
            >
              保存更改
            </button>
          </form>
        </div>

        <!-- 偏好设置 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">偏好设置</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-700">深色模式</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">邮件通知</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">推送通知</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 账户操作 -->
      <div class="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">账户操作</h2>
        <div class="space-y-3">
          <button
            class="w-full text-left bg-red-50 text-red-600 py-3 px-4 rounded-md hover:bg-red-100"
          >
            更改密码
          </button>
          <button
            class="w-full text-left bg-yellow-50 text-yellow-600 py-3 px-4 rounded-md hover:bg-yellow-100"
          >
            导出数据
          </button>
          <button
            class="w-full text-left bg-red-50 text-red-600 py-3 px-4 rounded-md hover:bg-red-100"
            @click="handleLogout"
          >
            退出登录
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
  name: 'Settings',
  components: {
    NavBar
  },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const userEmail = computed(() => userStore.user?.email || '')

    const handleLogout = async () => {
      await userStore.logout()
      router.push('/')
    }

    return {
      userEmail,
      handleLogout
    }
  }
}
</script>
