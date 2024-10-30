<script setup lang="ts">

</script>

<template>
  <div class="homeBox">
    <section>
      <h1>这是我的个人工作空间</h1>
      <span>极简主义 实用主义</span>
      <button>开始</button>
    </section>
  </div>
</template>

<style lang="less" scoped>
.homeBox {
  width: 100%;
  min-width: 750px;
  height: 100vh;
  min-height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  section {
    display: flex;
    flex-direction: column;
    align-items: center;

    h1,
    span,
    button {
      margin-bottom: 20px;
    }

    h1 {
      font-size: 35px;
      color: rgb(42, 16, 188);
    }

    button {
      width: 80px;
      height: 40px;
      border: none;
      border-radius: 40px;
      background-color: rgb(42, 16, 188);
      color: white;
    }
  }
}

</style>