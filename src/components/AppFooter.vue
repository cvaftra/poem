<template>
  <footer class="bg-dark text-white py-12">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-3 mb-4">
            <i class="fas fa-book text-2xl text-accent"></i>
            <span class="text-2xl font-bold">古诗词赏析</span>
          </div>
          <p class="text-gray-300 leading-relaxed">
            致力于传承和弘扬中华优秀传统文化，让更多人了解和喜爱古诗词，
            感受中华文化的博大精深和独特魅力。
          </p>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-4">快速链接</h3>
          <ul class="space-y-2">
            <li>
              <a href="#home" class="text-gray-300 hover:text-accent transition-colors">首页</a>
            </li>
            <li>
              <a href="#poems" class="text-gray-300 hover:text-accent transition-colors"
                >诗词精选</a
              >
            </li>
            <li>
              <a href="#poets" class="text-gray-300 hover:text-accent transition-colors"
                >诗人介绍</a
              >
            </li>
            <li>
              <a href="#about" class="text-gray-300 hover:text-accent transition-colors"
                >关于我们</a
              >
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-4">联系我们</h3>
          <ul class="space-y-2 text-gray-300">
            <li class="flex items-center space-x-2">
              <i class="fas fa-envelope text-accent"></i>
              <span>contact@poetry.com</span>
            </li>
            <li class="flex items-center space-x-2">
              <i class="fas fa-phone text-accent"></i>
              <span>+86 138 0013 8000</span>
            </li>
            <li class="flex items-center space-x-2">
              <i class="fas fa-map-marker-alt text-accent"></i>
              <span>北京市海淀区</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-600 mt-8 pt-8 text-center">
        <p class="text-gray-400">
          &copy; 2024 古诗词赏析. 保留所有权利. |
          <a href="#" class="hover:text-accent transition-colors">隐私政策</a> |
          <a href="#" class="hover:text-accent transition-colors">使用条款</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.bg-dark {
  background: linear-gradient(135deg, #2f1b0a 0%, #4a3526 100%);
}
</style>
