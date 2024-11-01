<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import BottomBar from '@/components/BottomBar.vue'
import { visit } from '@/services/apis/asset'
import { onMounted, onUnmounted } from 'vue'
import { useAssetStore } from '@/stores/asset'
const {_isVisit,_setIsVisit} = useAssetStore()
onMounted(()=>{
  if(!_isVisit){
    visit()
    _setIsVisit(true)
  }
  visit()
})
onUnmounted(()=>{
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
