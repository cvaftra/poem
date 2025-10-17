// 用户服务 - 处理数据库用户表操作
import supabase from '../utils/supabase.js'

export const userService = {
  // 根据邮箱获取用户信息
  async getUserByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  },

  // 根据用户名获取用户信息
  async getUserByUsername(username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  },

  // 验证用户登录（直接使用数据库验证）
  async validateUserLogin(identifier, password) {
    try {
      // 先尝试通过邮箱查找用户
      let user = await this.getUserByEmail(identifier)
      
      // 如果邮箱没找到，尝试通过用户名查找
      if (!user) {
        user = await this.getUserByUsername(identifier)
      }
      
      if (!user) {
        return { success: false, error: '用户不存在' }
      }
      
      if (!user.is_active) {
        return { success: false, error: '用户账户已被禁用' }
      }
      
      // 验证密码（使用base64编码比较）
      const inputPasswordHash = btoa(unescape(encodeURIComponent(password)))
      if (user.password_hash !== inputPasswordHash) {
        return { success: false, error: '密码错误' }
      }
      
      // 更新最后登录时间
      await this.updateLastLogin(user.id)
      
      return { success: true, user }
    } catch (error) {
      console.error('用户登录验证失败:', error)
      return { success: false, error: '登录验证失败' }
    }
  },

  // 根据用户ID获取用户信息
  async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  },

  // 创建新用户（注册时调用）
  async createUser(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          username: userData.username,
          email: userData.email,
          password_hash: userData.password_hash, // 注意：这里应该存储加密后的密码
          role: 'user',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('创建用户失败:', error)
      throw error
    }
  },

  // 更新用户信息
  async updateUser(userId, updateData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('更新用户信息失败:', error)
      throw error
    }
  },

  // 更新最后登录时间
  async updateLastLogin(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('更新登录时间失败:', error)
      throw error
    }
  },

  // 检查用户名是否已存在
  async checkUsernameExists(username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single()
      
      return !error && data !== null
    } catch (error) {
      return false
    }
  },

  // 检查邮箱是否已存在
  async checkEmailExists(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()
      
      return !error && data !== null
    } catch (error) {
      return false
    }
  },

  // 获取用户收藏的诗词
  async getUserFavorites(userId) {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          poem_id,
          poems (
            id,
            title,
            poet_id,
            poets (name),
            content,
            view_count,
            favorite_count
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('获取用户收藏失败:', error)
      return []
    }
  },

  // 添加诗词到收藏
  async addToFavorites(userId, poemId) {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert([{
          user_id: userId,
          poem_id: poemId,
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('添加收藏失败:', error)
      throw error
    }
  },

  // 从收藏中移除诗词
  async removeFromFavorites(userId, poemId) {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('poem_id', poemId)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('移除收藏失败:', error)
      throw error
    }
  },

  // 检查是否已收藏
  async isFavorite(userId, poemId) {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('poem_id', poemId)
        .single()
      
      return !error && data !== null
    } catch (error) {
      return false
    }
  }
}