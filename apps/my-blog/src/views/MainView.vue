<script setup lang="ts">
//导入路由相关API
import { RouterView } from 'vue-router'
//导入组件
import TabBar from '@/components/TabBar.vue'
import BottomBar from '@/components/BottomBar.vue'
//导入网站相关API
import { visit } from '@/services/apis/asset'
//导入Vue相关API
import { onMounted, onUnmounted, watchEffect } from 'vue'
//导入网站仓库
import { useAssetStore } from '@/stores/asset'
const { _isVisit, _setIsVisit } = useAssetStore()
//导入pinia相关api
import { storeToRefs } from 'pinia'

const { _theme } = storeToRefs(useAssetStore())
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
  <div class="mainBox" :class="{ 'dark-theme': _theme }">
    <TabBar></TabBar>
    <RouterView></RouterView>
    <BottomBar></BottomBar>
  </div>
</template>

<style lang="less" scoped>
:deep(.el-button) {
  --el-button-bg-color: var(--el-button-background-color) !important;
}
</style>
