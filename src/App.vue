<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TabBar from './components/TabBar.vue'
</script>

<template>
  <div class="app">
    <RouterView></RouterView>
  </div>
</template>

<style lang="less">
* {
  /* 去掉默认外边距 */
  margin: 0;
  /* 去默认内边距 */
  padding: 0;
}

ul {
  /* 去掉点 */
  list-style: none;
}
.app{
  width: 100%;
}
</style>
