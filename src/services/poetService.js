// 诗人数据服务
import { supabase } from '../lib/supabaseClient'

export const poetService = {
  // 获取所有诗人
  async getAllPoets() {
    try {
      const { data, error } = await supabase
        .from('poets')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取诗人数据失败:', error)
      return []
    }
  },

  // 根据ID获取诗人详情
  async getPoetById(id) {
    try {
      const { data, error } = await supabase
        .from('poets')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('获取诗人详情失败:', error)
      return null
    }
  },

  // 根据朝代获取诗人
  async getPoetsByDynasty(dynastyName) {
    try {
      // 先根据朝代名称获取朝代ID
      const { data: dynastyData, error: dynastyError } = await supabase
        .from('dynasties')
        .select('id')
        .eq('name', dynastyName)
        .single()
      
      if (dynastyError) throw dynastyError
      if (!dynastyData) return []
      
      // 根据朝代ID获取诗人
      const { data, error } = await supabase
        .from('poets')
        .select('*')
        .eq('dynasty_id', dynastyData.id)
        .order('name')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('根据朝代获取诗人失败:', error)
      return []
    }
  },

  // 搜索诗人
  async searchPoets(query) {
    try {
      const { data, error } = await supabase
        .from('poets')
        .select('*')
        .or(`name.ilike.%${query}%,introduction.ilike.%${query}%,style.ilike.%${query}%`)
        .order('name')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('搜索诗人失败:', error)
      return []
    }
  },

  // 获取热门诗人
  async getPopularPoets(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('poets')
        .select('*')
        .order('popularity', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取热门诗人失败:', error)
      return []
    }
  },

  // 添加新诗人
  async addPoet(poetData) {
    try {
      const { data, error } = await supabase
        .from('poets')
        .insert([poetData])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('添加诗人失败:', error)
      return null
    }
  },

  // 更新诗人信息
  async updatePoet(id, updates) {
    try {
      const { data, error } = await supabase
        .from('poets')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('更新诗人信息失败:', error)
      return null
    }
  },

  // 删除诗人
  async deletePoet(id) {
    try {
      const { error } = await supabase
        .from('poets')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('删除诗人失败:', error)
      return false
    }
  }
}

// 默认诗人数据（用于初始化或测试）
export const defaultPoets = [
  {
    id: 1,
    name: '李白',
    dynasty: '唐代',
    intro: '诗仙，浪漫主义诗人代表',
    detail: '李白（701年－762年），字太白，号青莲居士，唐朝浪漫主义诗人，被后人誉为「诗仙」。与杜甫并称为「李杜」，为了与另两位诗人李商隐与杜牧即「小李杜」区别，杜甫与李白又合称「大李杜」。',
    achievements: [
      '开创了唐代诗歌的浪漫主义风格',
      '作品想象丰富，语言流转自然，音律和谐多变',
      '代表作有《静夜思》、《望庐山瀑布》、《将进酒》等'
    ],
    popularity: 95,
    birth_year: 701,
    death_year: 762,
    birth_place: '绵州昌隆县（今四川江油）',
    style: '浪漫主义',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: '杜甫',
    dynasty: '唐代',
    intro: '诗圣，现实主义诗人代表',
    detail: '杜甫（712年－770年），字子美，自号少陵野老，唐代伟大的现实主义诗人。他的诗被称为「诗史」，后世称其杜拾遗、杜工部，也称他杜少陵、杜草堂。',
    achievements: [
      '唐代现实主义诗歌的代表人物',
      '作品深刻反映了唐代由盛转衰的历史过程',
      '代表作有《春望》、《登高》、《茅屋为秋风所破歌》等'
    ],
    popularity: 92,
    birth_year: 712,
    death_year: 770,
    birth_place: '河南巩县（今河南巩义）',
    style: '现实主义',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: '苏轼',
    dynasty: '宋代',
    intro: '东坡居士，文学全才',
    detail: '苏轼（1037年－1101年），字子瞻，号东坡居士，北宋文学家、书画家。与父苏洵、弟苏辙合称「三苏」。其文汪洋恣肆，明白畅达，与欧阳修并称「欧苏」，为「唐宋八大家」之一。',
    achievements: [
      '宋代文学最高成就的代表',
      '诗、词、散文、书、画等方面都有很高成就',
      '开创了豪放词派，代表作有《水调歌头》、《念奴娇·赤壁怀古》等'
    ],
    popularity: 90,
    birth_year: 1037,
    death_year: 1101,
    birth_place: '眉州眉山（今四川眉山）',
    style: '豪放派',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    name: '李清照',
    dynasty: '宋代',
    intro: '易安居士，婉约派代表',
    detail: '李清照（1084年－1155年），号易安居士，宋代女词人，婉约派代表。有「千古第一才女」之称。所作词，前期多写其悠闲生活，后期多悲叹身世，情调感伤。',
    achievements: [
      '宋代婉约词派的代表人物',
      '中国文学史上最伟大的女词人',
      '代表作有《声声慢》、《如梦令》、《醉花阴》等'
    ],
    popularity: 88,
    birth_year: 1084,
    death_year: 1155,
    birth_place: '齐州章丘（今山东济南）',
    style: '婉约派',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]