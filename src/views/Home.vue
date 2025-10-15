<template>
  <div class="min-h-screen">
    <NavBar />
    <HeroSection />
    <PoemList />
    <PoetIntroduction />
    <AppFooter />
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import HeroSection from '../components/HeroSection.vue'
import PoemList from '../components/PoemList.vue'
import PoetIntroduction from '../components/PoetIntroduction.vue'
import AppFooter from '../components/AppFooter.vue'

export default {
  name: 'Home',
  components: {
    NavBar,
    HeroSection,
    PoemList,
    PoetIntroduction,
    AppFooter
  }
}
</script>

<style scoped>
/* 页面特定样式 */
</style>