<template>
  <div class="layout">
    <Header />
    <slot></slot>
    <Footer />
  </div>
</template>

<script>
import Header from '@/Layout/Header.vue'
import Footer from '@/Layout/Footer.vue'
export default {
  components: { Header, Footer }
}
</script>

<style scoped>

</style>
