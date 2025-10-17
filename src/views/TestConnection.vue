<template>
  <div class="test-container">
    <h1>Supabase数据库连接测试</h1>
    <div class="connection-info">
      <h3>连接信息：</h3>
      <p><strong>URL:</strong> https://cmiftjtshaotgzsoshse.supabase.co</p>
      <p><strong>Anon Key:</strong> 已配置</p>
      <p><strong>Service Role Key:</strong> 已配置（用于服务端操作）</p>
    </div>

    <button :disabled="testing" class="test-btn" @click="handleTestConnection">
      {{ testing ? '测试中...' : '测试数据库连接' }}
    </button>

    <div v-if="result" class="result" :class="{ success: result.success, error: !result.success }">
      <h3>测试结果：</h3>
      <p>{{ result.message }}</p>
    </div>

    <div class="usage-examples">
      <h3>使用示例：</h3>
      <pre><code>import { getSupabaseClient } from '@/utils/supabase'

// 查询数据
const supabase = getSupabaseClient()
const { data, error } = await supabase
  .from('poems')
  .select('*')
  .limit(10)

// 插入数据
const { data, error } = await supabase
  .from('poems')
  .insert([{ title: '新诗', content: '内容' }])</code></pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { testConnection } from '@/utils/supabase'

const testing = ref(false)
const result = ref(null)

const handleTestConnection = async () => {
  testing.value = true
  result.value = null

  try {
    const connectionResult = await testConnection()
    result.value = connectionResult
  } catch (error) {
    result.value = {
      success: false,
      message: `测试过程中发生错误: ${error.message}`
    }
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.connection-info {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.test-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.test-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.result {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
}

.result.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.result.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.usage-examples {
  margin-top: 30px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

pre {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
}
</style>
