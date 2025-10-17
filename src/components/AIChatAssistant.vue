<template>
  <!-- 悬浮聊天助手按钮 -->
  <div class="fixed bottom-8 right-8 z-50">
    <!-- 聊天按钮 -->
    <button 
      v-if="!isChatOpen"
      @click="openChat"
      class="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
      aria-label="打开AI聊天助手"
    >
      <i class="fas fa-robot text-2xl"></i>
    </button>

    <!-- 聊天窗口 -->
    <div v-else class="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col">
      <!-- 聊天头部 -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div class="flex items-center">
          <i class="fas fa-robot mr-2"></i>
          <span class="font-semibold">古诗词AI助手</span>
        </div>
        <button 
          @click="closeChat"
          class="text-white hover:text-gray-200 transition-colors"
          aria-label="关闭聊天"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- 消息区域 -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
        <!-- 欢迎消息 -->
        <div v-if="messages.length === 0" class="text-center text-gray-500 text-sm">
          <p>您好！我是古诗词AI助手，可以帮您：</p>
          <p>• 搜索诗词</p>
          <p>• 诗词赏析</p>
          <p>• 诗人介绍</p>
          <p>• 诗词推荐</p>
        </div>

        <!-- 消息列表 -->
        <div v-for="(message, index) in messages" :key="index" class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
          <div class="max-w-[80%] rounded-lg p-3" :class="message.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'">
            <p class="text-sm">{{ message.content }}</p>
            <span class="text-xs text-gray-500 block mt-1">{{ formatTime(message.timestamp) }}</span>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="bg-gray-100 rounded-lg p-3">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="border-t p-3">
        <div class="flex space-x-2">
          <input
            v-model="userInput"
            @keyup.enter="sendMessage"
            placeholder="输入您的问题..."
            class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            :disabled="isLoading"
          />
          <button
            @click="sendMessage"
            :disabled="!userInput.trim() || isLoading"
            class="bg-blue-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { aiChatService } from '../services/aiChatService.js'

export default {
  name: 'AIChatAssistant',
  data() {
    return {
      isChatOpen: false,
      userInput: '',
      messages: [],
      isLoading: false
    }
  },
  methods: {
    openChat() {
      this.isChatOpen = true
      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    closeChat() {
      this.isChatOpen = false
    },
    async sendMessage() {
      if (!this.userInput.trim()) return

      const userMessage = {
        role: 'user',
        content: this.userInput.trim(),
        timestamp: new Date()
      }

      this.messages.push(userMessage)
      this.userInput = ''
      this.isLoading = true

      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom()
      })

      try {
        // 调用本地AI聊天服务
        const result = await aiChatService.sendMessage(userMessage.content)
        
        if (result.success) {
          const aiMessage = {
            role: 'assistant',
            content: result.data.response,
            timestamp: new Date()
          }
          this.messages.push(aiMessage)
        } else {
          throw new Error(result.error || 'AI服务响应失败')
        }
      } catch (error) {
        console.error('AI助手请求失败:', error)
        const errorMessage = {
          role: 'assistant',
          content: '抱歉，AI助手暂时无法响应，请稍后再试。',
          timestamp: new Date()
        }
        this.messages.push(errorMessage)
      } finally {
        this.isLoading = false
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    scrollToBottom() {
      if (this.$refs.messagesContainer) {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight
      }
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    handleKeydown(event) {
      if (event.key === 'Escape' && this.isChatOpen) {
        this.closeChat()
      }
    }
  },
  mounted() {
    // 添加键盘快捷键 (ESC关闭聊天)
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
  }
}
</script>

<style scoped>
/* 自定义滚动条样式 */
.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>