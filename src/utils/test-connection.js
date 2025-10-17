// 数据库连接测试脚本
import { testConnection } from './supabase.js'

// 测试数据库连接
const testDbConnection = async () => {
  console.log('正在测试Supabase数据库连接...')

  const result = await testConnection()

  if (result.success) {
    console.log('✅ ' + result.message)
    console.log('🎉 数据库连接成功！可以开始使用Supabase服务。')
  } else {
    console.error('❌ ' + result.message)
    console.log('💡 可能的原因：')
    console.log('   - 网络连接问题')
    console.log('   - Supabase项目配置问题')
    console.log('   - 数据库表不存在')
  }
}

// 如果直接运行此文件，则执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  testDbConnection()
}

export default testDbConnection
