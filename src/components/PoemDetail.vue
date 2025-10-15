<template>
  <section class="py-16 bg-ancient-paper">
    <div class="container mx-auto px-6">
      <div class="max-w-4xl mx-auto">
        <div class="scroll-style p-8 rounded-lg">
          <div class="text-center mb-8">
            <h2 class="text-4xl font-bold text-dark mb-2">{{ currentPoem?.title }}</h2>
            <p class="text-lg text-gray-600">{{ currentPoem?.author }} · {{ currentPoem?.dynasty }}</p>
          </div>
          
          <div class="poem-content text-center mb-8">
            <p v-for="(line, index) in currentPoem?.fullContent" :key="index" class="text-xl leading-loose mb-4">
              {{ line }}
            </p>
          </div>
          
          <div class="bg-white bg-opacity-50 rounded-lg p-6">
            <h3 class="text-2xl font-bold text-dark mb-4">诗词赏析</h3>
            <p class="text-gray-700 leading-relaxed">{{ currentPoem?.analysis }}</p>
          </div>
          
          <div class="flex justify-center space-x-4 mt-8">
            <button class="btn-primary">
              <i class="fas fa-share-alt mr-2"></i>分享
            </button>
            <button class="btn-secondary border-primary text-primary">
              <i class="fas fa-bookmark mr-2"></i>收藏
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PoemDetail',
  data() {
    return {
      currentPoem: {
        id: 1,
        title: '静夜思',
        author: '李白',
        dynasty: '唐代',
        fullContent: [
          '床前明月光，疑是地上霜。',
          '举头望明月，低头思故乡。'
        ],
        analysis: '这首诗写的是在寂静的月夜思念家乡的感受。诗的前两句，是写诗人在作客他乡的特定环境中一刹那间所产生的错觉。一个独处他乡的人，白天奔波忙碌，倒还能冲淡离愁，然而一到夜深人静的时候，心头就难免泛起阵阵思念故乡的波澜。'
      }
    }
  }
}
</script>

<style scoped>
.scroll-style {
  background: linear-gradient(135deg, #f5f1dc 0%, #e8e4c9 100%);
  border: 2px solid #8B4513;
  box-shadow: 0 8px 32px rgba(139, 69, 19, 0.3);
}
</style>