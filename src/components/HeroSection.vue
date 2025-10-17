<template>
  <section id="home" class="relative h-screen flex items-center justify-center pt-20">
    <div class="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20"></div>
    <div class="container mx-auto px-6 relative z-10 text-center">
      <div class="scroll-style max-w-4xl mx-auto p-8 rounded-lg">
        <h1 class="text-5xl font-bold text-dark mb-6">古诗词赏析</h1>
        <p class="text-xl text-gray-700 mb-8 leading-relaxed">
          传承千年文化，品味诗词之美。在这里，我们一同走进古人的精神世界，
          感受诗词的韵律与意境，体会中华文化的博大精深。
        </p>
        <div class="flex justify-center space-x-6">
          <button class="btn-primary"><i class="fas fa-book-open mr-2"></i>开始阅读</button>
          <button class="btn-secondary border-primary text-primary hover:bg-primary">
            <i class="fas fa-history mr-2"></i>历史沿革
          </button>
        </div>
      </div>
    </div>

    <!-- 滚动指示器 -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary">
      <div class="animate-bounce">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          ></path>
        </svg>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection'
}
</script>

<style scoped>
.scroll-style {
  background: linear-gradient(135deg, #f5f1dc 0%, #e8e4c9 100%);
  border: 2px solid #8b4513;
  box-shadow: 0 8px 32px rgba(139, 69, 19, 0.3);
}
</style>
