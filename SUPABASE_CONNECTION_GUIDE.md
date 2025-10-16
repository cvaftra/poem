# Supabase数据库连接指南

## 连接信息
- **URL**: https://cmiftjtshaotgzsoshse.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtaWZ0anRzaGFvdGd6c29zaHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzM1NjgsImV4cCI6MjA3NjA0OTU2OH0.bddg2yih1JypQ20D0AP3DjNTgbV04uCQvDNEiqwa9zM
- **Service Role Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucWh4c2ZwaWdieG92eW1qZ3F0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDUwOTMwMiwiZXhwIjoyMDc2MDg1MzAyfQ.r23vXYVKRjXC54kR1UAhJZCqYK0zFAPXEImInLM8M-s

## 连接步骤

### 1. 安装Supabase客户端
```bash
npm install @supabase/supabase-js
```

### 2. 配置连接
项目已创建配置文件：`src/utils/supabase.js`

### 3. 使用方法
```javascript
import { getSupabaseClient, testConnection } from '@/utils/supabase'

// 测试连接
const result = await testConnection()

// 获取客户端实例
const supabase = getSupabaseClient()

// 查询数据
const { data, error } = await supabase
  .from('表名')
  .select('*')
  .limit(10)

// 插入数据
const { data, error } = await supabase
  .from('表名')
  .insert([{ 字段: '值' }])
```

### 4. 测试连接
访问：http://localhost:5173/test-connection

## 安全注意事项
- Anon Key用于客户端操作（公开）
- Service Role Key用于服务端操作（保密）
- 不要将Service Role Key暴露在客户端代码中

## 项目结构
- `src/utils/supabase.js` - Supabase配置和连接
- `src/views/TestConnection.vue` - 连接测试页面
- `src/router/index.js` - 路由配置（已添加测试页面）

开发服务器已启动，可以访问测试页面验证连接。