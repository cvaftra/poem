// DeepSeek API配置（包含真实API密钥）
// 用于古诗词AI聊天助手的DeepSeek模型集成

const DEEPSEEK_API_KEY = 'sk-347cf00580644d36a754581fa856e28e';

class DeepSeekAIClient {
  constructor(apiKey = DEEPSEEK_API_KEY) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.deepseek.com/v1';
  }
  
  // 发送聊天请求
  async chatCompletion(messages, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 2000,
          stream: false,
          ...options
        })
      });
      
      if (!response.ok) {
        throw new Error(`DeepSeek API错误: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('DeepSeek API调用失败:', error);
      throw error;
    }
  }
  
  // 古诗词专用聊天方法
  async poemChat(userInput, intent, sessionId) {
    const systemPrompt = `你是一个专业的古诗词AI助手，专门帮助用户理解和欣赏中国古典诗词。请用中文回答，语气亲切专业。

根据用户意图提供相应的帮助：

1. 搜索意图（poem_search）：帮助用户搜索相关诗词，提供准确的诗词信息，包括作者、朝代、内容等
2. 赏析意图（poem_analysis）：对诗词进行深入分析和解读，包括创作背景、艺术特色、思想内涵、语言特点等
3. 推荐意图（poem_recommendation）：根据用户需求推荐合适的诗词，并说明推荐理由
4. 通用意图（general）：回答用户关于古诗词的各种问题，如历史背景、文学知识等

请确保回答准确、专业、易懂，适当引用具体诗词内容。`;

    const userMessage = {
      role: 'user',
      content: `用户问题：${userInput}
用户意图：${intent}
会话ID：${sessionId}

请根据以上信息提供专业的古诗词帮助。`
    };

    return await this.chatCompletion([
      { role: 'system', content: systemPrompt },
      userMessage
    ], {
      temperature: 0.7,
      max_tokens: 2000
    });
  }
  
  // 测试API连接
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          models: data.data,
          message: 'DeepSeek API连接成功'
        };
      } else {
        return {
          success: false,
          error: `API连接失败: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `连接错误: ${error.message}`
      };
    }
  }
}

// 创建实例
const deepSeekClient = new DeepSeekAIClient();

// 测试函数
async function testDeepSeekIntegration() {
  console.log('=== DeepSeek API连接测试 ===\\n');
  
  // 1. 测试API连接
  const connectionTest = await deepSeekClient.testConnection();
  console.log('连接测试结果:', connectionTest);
  
  if (!connectionTest.success) {
    console.log('API连接失败，无法继续测试');
    return;
  }
  
  console.log('\\n=== 古诗词功能测试 ===\\n');
  
  // 2. 测试古诗词功能
  const testCases = [
    {
      input: '帮我搜索李白的诗',
      intent: 'poem_search',
      description: '搜索类问题'
    },
    {
      input: '请赏析《静夜思》',
      intent: 'poem_analysis',
      description: '赏析类问题'
    },
    {
      input: '推荐几首经典唐诗',
      intent: 'poem_recommendation',
      description: '推荐类问题'
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`测试: ${testCase.description}`);
    console.log(`问题: ${testCase.input}`);
    console.log(`意图: ${testCase.intent}`);
    
    try {
      const result = await deepSeekClient.poemChat(
        testCase.input,
        testCase.intent,
        'test_session_001'
      );
      
      if (result.choices && result.choices.length > 0) {
        const aiResponse = result.choices[0].message.content;
        console.log(`AI回答: ${aiResponse.substring(0, 200)}...`);
        console.log(`使用情况: ${JSON.stringify(result.usage)}`);
      } else {
        console.log('未收到有效回答');
      }
    } catch (error) {
      console.log(`错误: ${error.message}`);
    }
    
    console.log('---\\n');
    
    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// n8n工作流配置（包含真实API密钥）
const n8nDeepSeekConfig = {
  apiKey: DEEPSEEK_API_KEY,
  endpoint: 'https://api.deepseek.com/v1/chat/completions',
  model: 'deepseek-chat',
  
  // HTTP请求配置
  httpRequest: {
    method: 'POST',
    url: 'https://api.deepseek.com/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的古诗词AI助手，专门帮助用户理解和欣赏中国古典诗词。'
        },
        {
          role: 'user',
          content: '={{ $json.userInput }}'
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: false
    }
  },
  
  // 环境变量配置（用于n8n）
  environmentVariables: {
    DEEPSEEK_API_KEY: DEEPSEEK_API_KEY
  }
};

// 导出配置
module.exports = {
  DEEPSEEK_API_KEY,
  DeepSeekAIClient,
  n8nDeepSeekConfig,
  testDeepSeekIntegration
};

// 安全提示
console.warn('注意：此文件包含真实的API密钥，请勿提交到版本控制系统！');
console.warn('建议将API密钥存储在环境变量中：');
console.warn('export DEEPSEEK_API_KEY=sk-347cf00580644d36a754581fa856e28e');

// 如果直接运行此文件，执行测试
if (require.main === module) {
  testDeepSeekIntegration().catch(console.error);
}