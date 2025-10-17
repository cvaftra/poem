<template>
  <section id="poems" class="py-20 bg-white bg-opacity-50">
    <div class="container mx-auto px-6">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-dark mb-4">诗词精选</h2>
        <p class="text-lg text-gray-600">精选历代经典诗词，感受中华文化的魅力</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="poem in poems" :key="poem.id" class="poem-card">
          <div class="text-center mb-4">
            <i class="fas fa-feather text-3xl text-primary"></i>
          </div>
          <h3 class="poem-title">{{ poem.title }}</h3>
          <div class="poem-content">
            <p v-for="line in poem.content.slice(0, 2)" :key="line" class="mb-2">
              {{ line }}
            </p>
            <p class="text-gray-500">...</p>
          </div>
          <p class="poem-author">—— {{ poem.author }} · {{ poem.dynasty }}</p>
          <button class="w-full mt-4 btn-primary" @click="viewPoemDetail(poem)">
            <i class="fas fa-eye mr-2"></i>查看详情
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'PoemList',
  setup() {
    const router = useRouter()
    
    const poems = [
      {
        id: 1,
        title: '静夜思',
        author: '李白',
        dynasty: '唐代',
        content: ['床前明月光，疑是地上霜。', '举头望明月，低头思故乡。'],
        fullContent: ['床前明月光，疑是地上霜。', '举头望明月，低头思故乡。'],
        analysis: '这首诗写的是在寂静的月夜思念家乡的感受。',
        tags: ['思乡', '月亮', '夜晚']
      },
      {
        id: 2,
        title: '春晓',
        author: '孟浩然',
        dynasty: '唐代',
        content: ['春眠不觉晓，处处闻啼鸟。', '夜来风雨声，花落知多少。'],
        fullContent: ['春眠不觉晓，处处闻啼鸟。', '夜来风雨声，花落知多少。'],
        analysis: '这首小诗初读似觉平淡无奇，反复读之，便觉诗中别有天地。',
        tags: ['春天', '自然', '生活']
      },
      {
        id: 3,
        title: '登鹳雀楼',
        author: '王之涣',
        dynasty: '唐代',
        content: ['白日依山尽，黄河入海流。', '欲穷千里目，更上一层楼。'],
        fullContent: ['白日依山尽，黄河入海流。', '欲穷千里目，更上一层楼。'],
        analysis: '这首诗写诗人在登高望远中表现出来的不凡的胸襟抱负。',
        tags: ['登高', '进取', '哲理']
      },
      {
        id: 4,
        title: '相思',
        author: '王维',
        dynasty: '唐代',
        content: ['红豆生南国，春来发几枝。', '愿君多采撷，此物最相思。'],
        fullContent: ['红豆生南国，春来发几枝。', '愿君多采撷，此物最相思。'],
        analysis: '这是借咏物而寄相思的诗，是眷怀友人之作。',
        tags: ['爱情', '思念', '红豆']
      },
      {
        id: 5,
        title: '江雪',
        author: '柳宗元',
        dynasty: '唐代',
        content: ['千山鸟飞绝，万径人踪灭。', '孤舟蓑笠翁，独钓寒江雪。'],
        fullContent: ['千山鸟飞绝，万径人踪灭。', '孤舟蓑笠翁，独钓寒江雪。'],
        analysis: '这首诗描绘了一幅江乡雪景图，塑造了渔翁的形象。',
        tags: ['冬天', '孤独', '雪景']
      },
      {
        id: 6,
        title: '悯农',
        author: '李绅',
        dynasty: '唐代',
        content: ['锄禾日当午，汗滴禾下土。', '谁知盘中餐，粒粒皆辛苦。'],
        fullContent: ['锄禾日当午，汗滴禾下土。', '谁知盘中餐，粒粒皆辛苦。'],
        analysis: '这首诗反映了农民辛勤劳动的情景，表达了珍惜粮食的思想。',
        tags: ['劳动', '农民', '珍惜']
      }
    ]

    const viewPoemDetail = (poem) => {
      router.push(`/poem/${poem.id}`)
    }

    return {
      poems,
      viewPoemDetail
    }
  }
}
</script>

<style scoped>
.poem-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f4e5 100%);
  border: 1px solid #e8e4c9;
}
</style>
