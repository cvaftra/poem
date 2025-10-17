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
      content: ['床前明月光，疑是地上霜。', '举头望明月，低头思故乡。'],
      fullContent: ['床前明月光，疑是地上霜。', '举头望明月，低头思故乡。'],
      analysis:
        '这首诗写的是在寂静的月夜思念家乡的感受。诗的前两句，是写诗人在作客他乡的特定环境中一刹那间所产生的错觉。一个独处他乡的人，白天奔波忙碌，倒还能冲淡离愁，然而一到夜深人静的时候，心头就难免泛起阵阵思念故乡的波澜。',
      tags: ['思乡', '月亮', '夜晚'],
      favorite: false
    },
    {
      id: 2,
      title: '春晓',
      author: '孟浩然',
      dynasty: '唐代',
      content: ['春眠不觉晓，处处闻啼鸟。', '夜来风雨声，花落知多少。'],
      fullContent: ['春眠不觉晓，处处闻啼鸟。', '夜来风雨声，花落知多少。'],
      analysis:
        '这首小诗初读似觉平淡无奇，反复读之，便觉诗中别有天地。它的艺术魅力不在于华丽的辞藻，不在于奇绝的艺术手法，而在于它的韵味。整首诗的风格就像行云流水一样平易自然，然而悠远深厚，独臻妙境。',
      tags: ['春天', '自然', '生活'],
      favorite: false
    },
    {
      id: 3,
      title: '望庐山瀑布',
      author: '李白',
      dynasty: '唐代',
      content: ['日照香炉生紫烟，遥看瀑布挂前川。', '飞流直下三千尺，疑是银河落九天。'],
      fullContent: ['日照香炉生紫烟，遥看瀑布挂前川。', '飞流直下三千尺，疑是银河落九天。'],
      analysis:
        '这首诗形象地描绘了庐山瀑布雄奇壮丽的景色，反映了诗人对祖国大好河山的无限热爱。诗人用夸张的比喻和浪漫的想象，将瀑布的壮观景象描绘得淋漓尽致。',
      tags: ['山水', '自然', '壮观'],
      favorite: false
    },
    {
      id: 4,
      title: '登鹳雀楼',
      author: '王之涣',
      dynasty: '唐代',
      content: ['白日依山尽，黄河入海流。', '欲穷千里目，更上一层楼。'],
      fullContent: ['白日依山尽，黄河入海流。', '欲穷千里目，更上一层楼。'],
      analysis:
        '这首诗写诗人在登高望远中表现出来的不凡的胸襟抱负，反映了盛唐时期人们积极向上的进取精神。前两句写所见，后两句写所感，情景交融，气势磅礴。',
      tags: ['登高', '进取', '哲理'],
      favorite: false
    },
    {
      id: 5,
      title: '江雪',
      author: '柳宗元',
      dynasty: '唐代',
      content: ['千山鸟飞绝，万径人踪灭。', '孤舟蓑笠翁，独钓寒江雪。'],
      fullContent: ['千山鸟飞绝，万径人踪灭。', '孤舟蓑笠翁，独钓寒江雪。'],
      analysis:
        '这首诗描绘了一幅江乡雪景图。诗人用极其洗炼的文笔，描绘了一幅幽静寒冷的画面：在下着大雪的江面上，一叶小舟，一个老渔翁，独自在寒冷的江心垂钓。',
      tags: ['冬天', '孤独', '雪景'],
      favorite: false
    },
    {
      id: 6,
      title: '相思',
      author: '王维',
      dynasty: '唐代',
      content: ['红豆生南国，春来发几枝。', '愿君多采撷，此物最相思。'],
      fullContent: ['红豆生南国，春来发几枝。', '愿君多采撷，此物最相思。'],
      analysis:
        '这是借咏物而寄相思的诗，是眷怀友人之作。全诗情调健美高雅，怀思饱满奔放，语言朴素无华，韵律和谐柔美。可谓绝句的上乘佳品。',
      tags: ['爱情', '思念', '红豆'],
      favorite: false
    },
    {
      id: 7,
      title: '水调歌头·明月几时有',
      author: '苏轼',
      dynasty: '宋代',
      content: ['明月几时有？把酒问青天。', '不知天上宫阙，今夕是何年。'],
      fullContent: ['明月几时有？把酒问青天。', '不知天上宫阙，今夕是何年。', '我欲乘风归去，又恐琼楼玉宇，高处不胜寒。', '起舞弄清影，何似在人间。'],
      analysis:
        '此词是中秋望月怀人之作，表达了对胞弟苏辙的无限怀念。词人运用形象描绘手法，勾勒出一种皓月当空、亲人千里、孤高旷远的境界氛围。',
      tags: ['中秋', '月亮', '思念'],
      favorite: false
    },
    {
      id: 8,
      title: '声声慢·寻寻觅觅',
      author: '李清照',
      dynasty: '宋代',
      content: ['寻寻觅觅，冷冷清清，凄凄惨惨戚戚。', '乍暖还寒时候，最难将息。'],
      fullContent: ['寻寻觅觅，冷冷清清，凄凄惨惨戚戚。', '乍暖还寒时候，最难将息。', '三杯两盏淡酒，怎敌他、晚来风急？', '雁过也，正伤心，却是旧时相识。'],
      analysis:
        '这首词通过描写残秋所见、所闻、所感，抒发自己因国破家亡、天涯沦落而产生的孤寂落寞、悲凉愁苦的心绪，具有浓厚的时代色彩。',
      tags: ['秋天', '忧愁', '孤独'],
      favorite: false
    }
  ])

  // 当前选中的诗词
  const currentPoem = ref(null)

  // 获取所有诗词
  const getAllPoems = computed(() => poems.value)

  // 根据ID获取诗词
  const getPoemById = (id) => {
    return poems.value.find((poem) => poem.id === id)
  }

  // 切换收藏状态
  const toggleFavorite = (id) => {
    const poem = poems.value.find((p) => p.id === id)
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
