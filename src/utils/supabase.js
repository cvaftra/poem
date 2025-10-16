// Supabase数据库连接配置
import { createClient } from '@supabase/supabase-js'

// Supabase配置信息
const supabaseUrl = 'https://cmiftjtshaotgzsoshse.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtaWZ0anRzaGFvdGd6c29zaHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzM1NjgsImV4cCI6MjA3NjA0OTU2OH0.bddg2yih1JypQ20D0AP3DjNTgbV04uCQvDNEiqwa9zM'

// 创建Supabase客户端实例
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 测试数据库连接
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('poems').select('count').limit(1)
    if (error) {
      throw error
    }
    return { success: true, message: '数据库连接成功' }
  } catch (error) {
    return { success: false, message: `数据库连接失败: ${error.message}` }
  }
}

// 获取Supabase客户端实例
export const getSupabaseClient = () => supabase

export default supabase