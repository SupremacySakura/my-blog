<script setup lang="ts">
//导入路由相关API
import { RouterLink, RouterView } from 'vue-router'
//导入组件
import TabBar from '@/components/TabBar.vue'
import BottomBar from '@/components/BottomBar.vue'
//导入网站相关API
import { visit } from '@/services/apis/asset'
//导入Vue相关API
import { onMounted, onUnmounted } from 'vue'
//导入网站仓库
import { useAssetStore } from '@/stores/asset'
const { _isVisit, _setIsVisit } = useAssetStore()

onMounted(() => {
  //初始化,访问
  if (!_isVisit) {
    visit()
    _setIsVisit(true)
  }
  visit()
})
onUnmounted(() => {
  _setIsVisit(false)
})
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
