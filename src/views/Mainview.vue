<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import BottomBar from '@/components/BottomBar.vue'
</script>

<template>
  <div class="mainBox">
    <TabBar></TabBar>
    <RouterView></RouterView>
    <BottomBar></BottomBar>
  </div>
</template>

<style lang="less" scoped>


</style>
