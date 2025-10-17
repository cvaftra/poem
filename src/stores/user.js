import { defineStore } from 'pinia'
import { ref } from 'vue'
import supabase from '../utils/supabase.js'
import { userService } from '../services/userService.js'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const userProfile = ref(null) // 数据库中的用户信息
  const isAuthenticated = ref(false)
  const loading = ref(false)

  // 初始化用户状态
  const initUser = async () => {
    // 这里可以添加本地存储的用户状态检查
    // 目前直接返回，用户需要手动登录
    return
  }

  // 从数据库加载用户详细信息
  const loadUserProfile = async (userId) => {
    try {
      const profile = await userService.getUserById(userId)
      if (profile) {
        userProfile.value = profile
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
    }
  }

  // 登录
  const login = async (identifier, password) => {
    loading.value = true
    try {
      // 使用用户服务直接验证数据库中的用户信息
      const result = await userService.validateUserLogin(identifier, password)
      
      if (!result.success) {
        return result
      }
      
      // 登录成功，设置用户状态
      user.value = result.user
      userProfile.value = result.user
      isAuthenticated.value = true
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // 注册（使用数据库用户表）
  const register = async (email, password, username) => {
    loading.value = true
    try {
      // 检查用户名和邮箱是否已存在
      const [usernameExists, emailExists] = await Promise.all([
        userService.checkUsernameExists(username),
        userService.checkEmailExists(email)
      ])

      if (usernameExists) {
        return { success: false, error: '用户名已存在' }
      }

      if (emailExists) {
        return { success: false, error: '邮箱已存在' }
      }

      // 直接创建用户记录到数据库
      const password_hash = btoa(unescape(encodeURIComponent(password)))
      
      const newUser = await userService.createUser({
        username,
        email,
        password_hash,
        role: 'user',
        is_active: true
      })

      if (newUser) {
        // 注册成功后自动登录
        user.value = newUser
        userProfile.value = newUser
        isAuthenticated.value = true
        return { success: true }
      } else {
        return { success: false, error: '用户创建失败' }
      }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = async () => {
    try {


      user.value = null
      userProfile.value = null
      isAuthenticated.value = false
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 更新用户信息
  const updateProfile = async (updateData) => {
    try {
      if (!userProfile.value) throw new Error('用户未登录')
      
      const updatedProfile = await userService.updateUser(userProfile.value.id, updateData)
      userProfile.value = { ...userProfile.value, ...updatedProfile }
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 获取用户收藏
  const getFavorites = async () => {
    try {
      if (!userProfile.value) throw new Error('用户未登录')
      return await userService.getUserFavorites(userProfile.value.id)
    } catch (error) {
      console.error('获取收藏失败:', error)
      return []
    }
  }

  // 添加收藏
  const addFavorite = async (poemId) => {
    try {
      if (!userProfile.value) throw new Error('用户未登录')
      return await userService.addToFavorites(userProfile.value.id, poemId)
    } catch (error) {
      throw error
    }
  }

  // 移除收藏
  const removeFavorite = async (poemId) => {
    try {
      if (!userProfile.value) throw new Error('用户未登录')
      return await userService.removeFromFavorites(userProfile.value.id, poemId)
    } catch (error) {
      throw error
    }
  }

  // 检查是否已收藏
  const checkFavorite = async (poemId) => {
    try {
      if (!userProfile.value) return false
      return await userService.isFavorite(userProfile.value.id, poemId)
    } catch (error) {
      return false
    }
  }



  return {
    user,
    userProfile,
    isAuthenticated,
    loading,
    initUser,
    login,
    register,
    logout,
    updateProfile,
    getFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite
  }
})
