<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
          <i class="fas fa-book text-white text-xl"></i>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">古诗词赏析平台</h2>
        <p class="mt-2 text-center text-sm text-gray-600">登录您的账户</p>
      </div>

      <LoginModal @success="handleLoginSuccess" @close="redirectToHome" />
    </div>
  </div>
</template>

<script>
import LoginModal from '../components/LoginModal.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  components: {
    LoginModal
  },
  setup() {
    const router = useRouter()

    const handleLoginSuccess = () => {
      router.push('/')
    }

    const redirectToHome = () => {
      router.push('/')
    }

    return {
      handleLoginSuccess,
      redirectToHome
    }
  }
}
</script>
