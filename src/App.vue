<script setup lang="ts">
import { RouterView } from 'vue-router'
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

  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;

  /* IE 和 Edge */
  &::-webkit-scrollbar {
    display: none;
    /* Chrome、Safari、Edge */
  }
}

ul {
  /* 去掉点 */
  list-style: none;
}

.app {
  width: 100%;
}
</style>
