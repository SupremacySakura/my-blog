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
  width: 100vw;
  box-sizing: border-box;
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
      width: 250px;
      height: 26px;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: skyblue;
      overflow: hidden;
      span{
        height: 100%;
        line-height: 26px;
        text-align: center;
      }
      a{
        color: rgb(255,255,255,1);
        text-decoration: none;
        background-color: #424243;
        line-height: 26px;
        height: 100%;
        padding: 5px;
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