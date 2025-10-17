<template>
  <section id="poets" class="py-20 bg-dark text-white">
    <div class="container mx-auto px-6">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold mb-4">著名诗人</h2>
        <p class="text-lg text-gray-300">了解历代伟大诗人的生平与成就</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="poet in poets"
          :key="poet.id"
          class="bg-white bg-opacity-10 rounded-lg p-6 text-center"
        >
          <div
            class="w-20 h-20 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center"
          >
            <i class="fas fa-user text-3xl text-white"></i>
          </div>
          <h3 class="text-xl font-bold mb-2">{{ poet.name }}</h3>
          <p class="text-gray-300 mb-3">{{ poet.dynasty }}</p>
          <p class="text-sm text-gray-400 mb-4">{{ poet.intro }}</p>
          <button
            class="btn-secondary border-white text-white hover:bg-white hover:text-dark text-sm"
            @click="viewPoetDetail(poet)"
          >
            了解更多
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'PoetIntroduction',
  setup() {
    const router = useRouter()
    
    const poets = [
      {
        id: 1,
        name: '李白',
        dynasty: '唐代',
        intro: '诗仙，浪漫主义诗人代表',
        detail: '李白（701年－762年），字太白，号青莲居士，唐朝浪漫主义诗人，被后人誉为「诗仙」。'
      },
      {
        id: 2,
        name: '杜甫',
        dynasty: '唐代',
        intro: '诗圣，现实主义诗人代表',
        detail: '杜甫（712年－770年），字子美，自号少陵野老，唐代伟大的现实主义诗人。'
      },
      {
        id: 3,
        name: '苏轼',
        dynasty: '宋代',
        intro: '东坡居士，文学全才',
        detail: '苏轼（1037年－1101年），字子瞻，号东坡居士，北宋文学家、书画家。'
      },
      {
        id: 4,
        name: '李清照',
        dynasty: '宋代',
        intro: '易安居士，婉约派代表',
        detail: '李清照（1084年－1155年），号易安居士，宋代女词人，婉约派代表。'
      }
    ]

    const viewPoetDetail = (poet) => {
      router.push(`/poet/${poet.id}`)
    }

    return {
      poets,
      viewPoetDetail
    }
  }
}
</script>

<style scoped>
.bg-dark {
  background: linear-gradient(135deg, #2f1b0a 0%, #4a3526 100%);
}
</style>
