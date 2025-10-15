<template>
  <div id="app" class="ancient-bg min-h-screen">
    <NavBar />
    <HeroSection />
    <PoemList />
    <PoemDetail />
    <PoetIntroduction />
    <AppFooter />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import PoemList from './components/PoemList.vue'
import PoemDetail from './components/PoemDetail.vue'
import PoetIntroduction from './components/PoetIntroduction.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    HeroSection,
    PoemList,
    PoemDetail,
    PoetIntroduction,
    AppFooter
  }
}
</script>

<style>
/* 全局样式 */
</style>