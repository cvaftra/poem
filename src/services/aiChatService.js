// AI聊天助手服务 - 本地模拟版本
import { searchService } from './searchService.js'

// 模拟AI响应数据
const mockAIResponses = {
  '李白': '李白（701年－762年），字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。他的诗作豪放飘逸，想象丰富，语言优美，代表作有《将进酒》、《静夜思》、《望庐山瀑布》等。',
  
  '杜甫': '杜甫（712年－770年），字子美，自号少陵野老，唐代伟大的现实主义诗人，被后人尊为"诗圣"。他的诗作沉郁顿挫，深刻反映了唐代由盛转衰的历史过程，代表作有《春望》、《登高》、《茅屋为秋风所破歌》等。',
  
  '苏轼': '苏轼（1037年－1101年），字子瞻，号东坡居士，北宋著名文学家、书画家。他的诗词豪放洒脱，题材广阔，代表作有《水调歌头·明月几时有》、《念奴娇·赤壁怀古》等。',
  
  '搜索': '我可以帮您搜索诗词。请告诉我您想搜索的具体内容，比如诗词标题、作者、朝代或关键词。',
  
  '赏析': '我可以为您提供诗词赏析。请告诉我您想了解哪首诗词的赏析。',
  
  '推荐': '我可以为您推荐经典诗词。您想了解哪个朝代或主题的诗词？'
}

// 检测用户意图
function detectIntent(userInput) {
  const input = userInput.toLowerCase()
  
  if (input.includes('搜索') || input.includes('查找') || input.includes('找') || input.includes('查询')) {
    return 'search'
  } else if (input.includes('赏析') || input.includes('解释') || input.includes('含义') || input.includes('分析')) {
    return 'analysis'
  } else if (input.includes('推荐') || input.includes('建议') || input.includes('有什么') || input.includes('哪些')) {
    return 'recommendation'
  } else if (input.includes('李白') || input.includes('诗仙')) {
    return 'poet_li_bai'
  } else if (input.includes('杜甫') || input.includes('诗圣')) {
    return 'poet_du_fu'
  } else if (input.includes('苏轼') || input.includes('东坡')) {
    return 'poet_su_shi'
  } else {
    return 'general'
  }
}

// 生成AI响应
async function generateAIResponse(userInput) {
  const intent = detectIntent(userInput)
  
  // 如果是搜索意图，调用实际的搜索服务
  if (intent === 'search') {
    try {
      const searchResults = await searchService.searchPoems(userInput)
      if (searchResults.length > 0) {
        const poems = searchResults.slice(0, 3).map(poem => 
          `${poem.title} - ${poem.author}（${poem.dynasty}）`
        ).join('、')
        return `为您找到以下相关诗词：${poems}。您想了解哪首诗词的详细信息？`
      } else {
        return '抱歉，没有找到相关的诗词。请尝试其他关键词。'
      }
    } catch (error) {
      console.error('搜索服务错误:', error)
      return '搜索服务暂时不可用，请稍后再试。'
    }
  }
  
  // 其他意图使用模拟响应
  switch (intent) {
    case 'poet_li_bai':
      return mockAIResponses['李白']
    case 'poet_du_fu':
      return mockAIResponses['杜甫']
    case 'poet_su_shi':
      return mockAIResponses['苏轼']
    case 'analysis':
      return mockAIResponses['赏析']
    case 'recommendation':
      return mockAIResponses['推荐']
    default:
      return `您好！我是古诗词AI助手。您问的是"${userInput}"，我可以帮您：\n\n1. 搜索相关诗词\n2. 提供诗词赏析\n3. 推荐经典诗词\n4. 介绍诗人信息\n\n请告诉我您具体想了解什么？`
  }
}

// 主服务函数
export const aiChatService = {
  async sendMessage(userInput) {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const response = await generateAIResponse(userInput)
      
      return {
        success: true,
        data: {
          response: response,
          type: 'text',
          timestamp: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('AI聊天服务错误:', error)
      return {
        success: false,
        error: 'AI服务暂时不可用',
        data: {
          response: '抱歉，AI助手暂时无法响应，请稍后再试。',
          type: 'error'
        }
      }
    }
  }
}

export default aiChatService