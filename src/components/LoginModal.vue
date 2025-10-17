<template>
  <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-800">{{ isLogin ? '登录' : '注册' }}</h3>
        <button class="text-gray-400 hover:text-gray-600" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>
        
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div v-if="!isLogin">
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input
              v-model="form.username"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入用户名"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ isLogin ? '用户名或邮箱' : '邮箱' }}</label>
            <input
              v-model="form.email"
              :type="isLogin ? 'text' : 'email'"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :placeholder="isLogin ? '请输入用户名或邮箱' : '请输入邮箱'"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入密码"
              required
            />
          </div>
          
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ loading ? '处理中...' : (isLogin ? '登录' : '注册') }}
          </button>
        </form>
        
        <div class="mt-4 text-center">
          <button
            class="text-blue-600 hover:text-blue-800 text-sm"
            @click="toggleMode"
          >
            {{ isLogin ? '没有账号？点击注册' : '已有账号？点击登录' }}
          </button>
        </div>
      </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

export default {
  name: 'LoginModal',
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const userStore = useUserStore()
    const isLogin = ref(true)
    const loading = ref(false)
    const error = ref('')
    
    const form = ref({
      username: '',
      email: '',
      password: ''
    })

    const handleSubmit = async () => {
      loading.value = true
      error.value = ''
      
      try {
        let result
        if (isLogin.value) {
          result = await userStore.login(form.value.email, form.value.password)
        } else {
          // 注册时验证用户名格式
          if (form.value.username.length < 2) {
            error.value = '用户名至少需要2个字符'
            loading.value = false
            return
          }
          
          if (form.value.password.length < 6) {
            error.value = '密码至少需要6个字符'
            loading.value = false
            return
          }
          
          result = await userStore.register(form.value.email, form.value.password, form.value.username)
        }
        
        if (result.success) {
          emit('success')
          emit('close')
        } else {
          error.value = result.error
        }
      } catch (err) {
        error.value = '操作失败，请重试'
      } finally {
        loading.value = false
      }
    }

    // 重置表单
    const resetForm = () => {
      form.value = {
        username: '',
        email: '',
        password: ''
      }
      error.value = ''
    }

    // 切换登录/注册模式
    const toggleMode = () => {
      isLogin.value = !isLogin.value
      resetForm()
    }

    return {
      isLogin,
      loading,
      error,
      form,
      handleSubmit,
      toggleMode
    }
  }
}
</script>