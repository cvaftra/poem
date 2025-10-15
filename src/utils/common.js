// 通用工具函数

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} delay - 延迟时间
 * @returns {Function} 节流后的函数
 */
export function throttle(func, delay) {
  let lastCall = 0
  return function (...args) {
    const now = new Date().getTime()
    if (now - lastCall < delay) {
      return
    }
    lastCall = now
    return func.apply(this, args)
  }
}

/**
 * 深拷贝对象
 * @param {Object} obj - 要拷贝的对象
 * @returns {Object} 深拷贝后的对象
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 生成随机ID
 * @returns {string} 随机ID
 */
export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}