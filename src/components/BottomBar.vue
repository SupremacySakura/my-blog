<script setup lang="ts">

</script>

<template>
  <div class="bottomBox">
    <section class="leftSection">
      <div>
        <span>版权归属@余心知秋</span>
      </div>
      <div class="beian">
        <span>备案号:</span>
        <a href="https://beian.miit.gov.cn/" target="_blank">渝ICP备2024044515号-1</a>
      </div>
    </section>
  </div>
</template>

<style lang="less" scoped>
.bottomBox {
  width: 100%;
  min-width: 600px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid rgba(224, 224, 224, 1);
  background-color: rgba(255,255,255,1);
  justify-content: space-around;
  padding: 10px;
  .leftSection{
    width: 500px;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .beian{
      width: 224px;
      height: 26px;
      border-radius: 5px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-color: #424243;
      overflow: hidden;
      span{
        height: 100%;
        line-height: 26px;
        background-color: skyblue;
      }
      a{
        color: rgb(255,255,255,1);
        text-decoration: none;
        &:hover{
          color: rgb(102.2, 177.4, 255);
        }
      }
    }
  }
  span {
    color: black;
  }
}
</style>