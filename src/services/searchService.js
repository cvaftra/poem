// 诗词搜索服务 - 数据库版本
import supabase from '../utils/supabase.js'

export const searchService = {
  // 搜索诗词
  async searchPoems(keyword, filters = {}) {
    try {
      if (!keyword.trim()) {
        // 如果没有关键词，返回热门诗词
        return await this.getPopularPoems()
      }
      
      const searchTerm = keyword.trim()
      
      // 使用Supabase进行全文搜索
      const { data: poems, error } = await supabase
        .from('poems')
        .select(`
          *,
          poets(name),
          dynasties(name)
        `)
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,full_content.ilike.%${searchTerm}%`)
        .order('popularity_score', { ascending: false })
        .limit(50)
      
      // 如果直接搜索没有结果，尝试通过诗人姓名搜索
      if (poems.length === 0) {
        const { data: poets, error: poetError } = await supabase
          .from('poets')
          .select('id')
          .ilike('name', `%${searchTerm}%`)
          .limit(10)
        
        if (!poetError && poets.length > 0) {
          const poetIds = poets.map(poet => poet.id)
          const { data: poemsByPoet, error: poemsError } = await supabase
            .from('poems')
            .select(`
              *,
              poets(name),
              dynasties(name)
            `)
            .in('poet_id', poetIds)
            .order('popularity_score', { ascending: false })
            .limit(50)
          
          if (!poemsError) {
            return poemsByPoet.map(poem => ({
              id: poem.id,
              title: poem.title,
              author: poem.poets?.name || '未知',
              dynasty: poem.dynasties?.name || '未知',
              content: poem.content ? poem.content.split('\
').filter(line => line.trim()) : [],
              fullContent: poem.full_content ? poem.full_content.split('\
').filter(line => line.trim()) : [],
              analysis: poem.analysis,
              translation: poem.translation,
              tags: [],
              popularity: poem.popularity_score,
              viewCount: poem.view_count,
              favoriteCount: poem.favorite_count
            }))
          }
        }
      }
      
      if (error) throw error
      
      // 格式化返回数据
      return poems.map(poem => ({
        id: poem.id,
        title: poem.title,
        author: poem.poets?.name || '未知',
        dynasty: poem.dynasties?.name || '未知',
        content: poem.content ? poem.content.split('\n').filter(line => line.trim()) : [],
        fullContent: poem.full_content ? poem.full_content.split('\n').filter(line => line.trim()) : [],
        analysis: poem.analysis,
        translation: poem.translation,
        tags: [], // 需要单独查询标签
        popularity: poem.popularity_score,
        viewCount: poem.view_count,
        favoriteCount: poem.favorite_count
      }))
      
    } catch (error) {
      console.error('搜索诗词失败:', error)
      return []
    }
  },
  
  // 高级搜索
  async advancedSearch(criteria) {
    try {
      let query = supabase
        .from('poems')
        .select(`
          *,
          poets(name),
          dynasties(name)
        `)
      
      // 朝代筛选
      if (criteria.dynasty && criteria.dynasty !== 'all') {
        const { data: dynastyData, error: dynastyError } = await supabase
          .from('dynasties')
          .select('id')
          .eq('name', criteria.dynasty)
          .single()
        
        if (!dynastyError && dynastyData) {
          query = query.eq('dynasty_id', dynastyData.id)
        }
      }
      
      // 作者筛选
      if (criteria.author) {
        const { data: poetData, error: poetError } = await supabase
          .from('poets')
          .select('id')
          .ilike('name', `%${criteria.author}%`)
          .single()
        
        if (!poetError && poetData) {
          query = query.eq('poet_id', poetData.id)
        }
      }
      
      // 关键词搜索
      if (criteria.keyword) {
        query = query.or(`title.ilike.%${criteria.keyword}%,content.ilike.%${criteria.keyword}%`)
      }
      
      const { data: poems, error } = await query
        .order('popularity_score', { ascending: false })
        .limit(50)
      
      if (error) throw error
      
      // 格式化返回数据
      return poems.map(poem => ({
        id: poem.id,
        title: poem.title,
        author: poem.poets?.name || '未知',
        dynasty: poem.dynasties?.name || '未知',
        content: poem.content ? poem.content.split('\n').filter(line => line.trim()) : [],
        fullContent: poem.full_content ? poem.full_content.split('\n').filter(line => line.trim()) : [],
        analysis: poem.analysis,
        translation: poem.translation,
        tags: [],
        popularity: poem.popularity_score,
        viewCount: poem.view_count,
        favoriteCount: poem.favorite_count
      }))
      
    } catch (error) {
      console.error('高级搜索失败:', error)
      return []
    }
  },
  
  // 搜索诗人
  async searchPoets(keyword) {
    try {
      const { data: poets, error } = await supabase
        .from('poets')
        .select(`
          *,
          dynasties(name)
        `)
        .or(`name.ilike.%${keyword}%,introduction.ilike.%${keyword}%,style.ilike.%${keyword}%`)
        .order('name')
        .limit(20)
      
      if (error) throw error
      
      return poets.map(poet => ({
        id: poet.id,
        name: poet.name,
        pseudonym: poet.pseudonym,
        dynasty: poet.dynasties?.name || '未知',
        birthYear: poet.birth_year,
        deathYear: poet.death_year,
        birthplace: poet.birthplace,
        introduction: poet.introduction,
        style: poet.style,
        honorificTitle: poet.honorific_title
      }))
      
    } catch (error) {
      console.error('搜索诗人失败:', error)
      return []
    }
  },
  
  // 获取热门诗词
  async getPopularPoems(limit = 12) {
    try {
      const { data: poems, error } = await supabase
        .from('poems')
        .select(`
          *,
          poets(name),
          dynasties(name)
        `)
        .order('popularity_score', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      
      return poems.map(poem => ({
        id: poem.id,
        title: poem.title,
        author: poem.poets?.name || '未知',
        dynasty: poem.dynasties?.name || '未知',
        content: poem.content ? poem.content.split('\n').filter(line => line.trim()) : [],
        fullContent: poem.full_content ? poem.full_content.split('\n').filter(line => line.trim()) : [],
        analysis: poem.analysis,
        translation: poem.translation,
        tags: [],
        popularity: poem.popularity_score,
        viewCount: poem.view_count,
        favoriteCount: poem.favorite_count
      }))
      
    } catch (error) {
      console.error('获取热门诗词失败:', error)
      return []
    }
  },
  
  // 获取所有朝代
  async getAllDynasties() {
    try {
      const { data: dynasties, error } = await supabase
        .from('dynasties')
        .select('name')
        .order('name')
      
      if (error) throw error
      
      return dynasties.map(d => d.name)
    } catch (error) {
      console.error('获取朝代列表失败:', error)
      return []
    }
  },
  
  // 获取所有标签
  async getAllTags() {
    try {
      const { data: tags, error } = await supabase
        .from('tags')
        .select('name')
        .order('name')
      
      if (error) throw error
      
      return tags.map(t => t.name)
    } catch (error) {
      console.error('获取标签列表失败:', error)
      return []
    }
  },
  
  // 获取热门搜索关键词
  getPopularKeywords() {
    return [
      '李白', '杜甫', '唐诗', '宋词', '春天', '月亮', 
      '思乡', '爱情', '山水', '边塞', '饮酒', '离别'
    ]
  },
  
  // 搜索建议
  async getSearchSuggestions(keyword) {
    try {
      if (!keyword.trim()) return []
      
      const searchTerm = keyword.toLowerCase()
      const suggestions = new Set()
      
      // 搜索诗人建议
      const { data: poets, error: poetsError } = await supabase
        .from('poets')
        .select('name')
        .ilike('name', `%${searchTerm}%`)
        .limit(3)
      
      if (!poetsError && poets) {
        poets.forEach(poet => suggestions.add(poet.name))
      }
      
      // 搜索诗词标题建议
      const { data: poems, error: poemsError } = await supabase
        .from('poems')
        .select('title')
        .ilike('title', `%${searchTerm}%`)
        .limit(3)
      
      if (!poemsError && poems) {
        poems.forEach(poem => suggestions.add(poem.title))
      }
      
      // 搜索标签建议
      const { data: tags, error: tagsError } = await supabase
        .from('tags')
        .select('name')
        .ilike('name', `%${searchTerm}%`)
        .limit(3)
      
      if (!tagsError && tags) {
        tags.forEach(tag => suggestions.add(tag.name))
      }
      
      return Array.from(suggestions).slice(0, 5)
      
    } catch (error) {
      console.error('获取搜索建议失败:', error)
      return []
    }
  }
}