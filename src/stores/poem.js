import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePoemStore = defineStore('poem', () => {
  // 诗词数据
  const poems = ref([
    {
      id: 1,
      title: '静夜思',
      author: '李白',
      dynasty: '唐代',
      content: [
        '床前明月光，疑是地上霜。',
        '举头望明月，低头思故乡。'
      ],
      fullContent: [
        '床前明月光，疑是地上霜。',
        '举头望明月，低头思故乡。'
      ],
      analysis: '这首诗写的是在寂静的月夜思念家乡的感受。诗的前两句，是写诗人在作客他乡的特定环境中一刹那间所产生的错觉。一个独处他乡的人，白天奔波忙碌，倒还能冲淡离愁，然而一到夜深人静的时候，心头就难免泛起阵阵思念故乡的波澜。',
      tags: ['思乡', '月亮', '夜晚'],
      favorite: false
    },
    {
      id: 2,
      title: '春晓',
      author: '孟浩然',
      dynasty: '唐代',
      content: [
        '春眠不觉晓，处处闻啼鸟。',
        '夜来风雨声，花落知多少。'
      ],
      fullContent: [
        '春眠不觉晓，处处闻啼鸟。',
        '夜来风雨声，花落知多少。'
      ],
      analysis: '这首小诗初读似觉平淡无奇，反复读之，便觉诗中别有天地。它的艺术魅力不在于华丽的辞藻，不在于奇绝的艺术手法，而在于它的韵味。整首诗的风格就像行云流水一样平易自然，然而悠远深厚，独臻妙境。',
      tags: ['春天', '自然', '生活'],
      favorite: false
    }
  ])

  // 当前选中的诗词
  const currentPoem = ref(null)

  // 获取所有诗词
  const getAllPoems = computed(() => poems.value)

  // 根据ID获取诗词
  const getPoemById = (id) => {
    return poems.value.find(poem => poem.id === id)
  }

  // 切换收藏状态
  const toggleFavorite = (id) => {
    const poem = poems.value.find(p => p.id === id)
    if (poem) {
      poem.favorite = !poem.favorite
    }
  }

  // 设置当前诗词
  const setCurrentPoem = (poem) => {
    currentPoem.value = poem
  }

  return {
    poems,
    currentPoem,
    getAllPoems,
    getPoemById,
    toggleFavorite,
    setCurrentPoem
  }
})