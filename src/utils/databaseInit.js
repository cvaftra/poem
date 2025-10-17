// 数据库初始化脚本
import supabase from './supabase'

export const databaseInit = {
  // 检查并创建必要的表
  async initializeDatabase() {
    try {
      console.log('开始检查数据库表结构...')
      
      // 检查用户表是否存在
      const { data: usersTable, error: usersError } = await supabase
        .from('users')
        .select('id')
        .limit(1)
      
      if (usersError) {
        console.log('用户表不存在或无法访问，需要创建表结构')
        return false
      }
      
      console.log('数据库表结构检查通过')
      return true
    } catch (error) {
      console.error('数据库初始化失败:', error)
      return false
    }
  },

  // 创建示例用户数据（用于测试）
  async createSampleUsers() {
    try {
      // 检查是否已有用户数据
      const { data: existingUsers, error } = await supabase
        .from('users')
        .select('id')
        .limit(1)
      
      if (error || existingUsers.length === 0) {
        console.log('创建示例用户数据...')
        
        // 注意：实际项目中应该使用加密密码
        const sampleUsers = [
          {
            username: 'admin',
            email: 'admin@poem.com',
            password_hash: btoa('admin123'), // base64编码，实际项目请使用bcrypt
            role: 'admin',
            bio: '系统管理员',
            is_active: true
          },
          {
            username: 'user1',
            email: 'user1@poem.com',
            password_hash: btoa('user123'),
            role: 'user',
            bio: '诗词爱好者',
            is_active: true
          }
        ]
        
        const { data, error: insertError } = await supabase
          .from('users')
          .insert(sampleUsers)
          .select()
        
        if (insertError) throw insertError
        console.log('示例用户创建成功')
        return data
      }
      
      console.log('用户数据已存在，跳过创建示例用户')
      return existingUsers
    } catch (error) {
      console.error('创建示例用户失败:', error)
      return null
    }
  },

  // 测试数据库连接和表结构
  async testDatabase() {
    try {
      console.log('测试数据库连接...')
      
      // 测试用户表
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('count')
        .limit(1)
      
      if (usersError) {
        console.error('用户表测试失败:', usersError.message)
        return false
      }
      
      // 测试诗词表
      const { data: poems, error: poemsError } = await supabase
        .from('poems')
        .select('count')
        .limit(1)
      
      if (poemsError) {
        console.error('诗词表测试失败:', poemsError.message)
        return false
      }
      
      console.log('数据库连接测试通过')
      return true
    } catch (error) {
      console.error('数据库测试失败:', error)
      return false
    }
  }
}

// 导出默认实例
export default databaseInit