<script setup lang="ts">
import { ref,onMounted } from 'vue'
//导入测试图片
import test1 from '@/assets/test1.jpg'
//导入接口
import { getPoetry } from '@/services/apis/poetry'
const handleGetPoetry =async ()=>{
  const res = await getPoetry()
  if(+res.data.code===200){
    poetryList.value = res.data.data
    poetryList.value.forEach((item)=>{
      if(!item.photo){
        item.photo = test1
      }
    })
  }
  console.log(poetryList.value)
}
//定义是个类型接口
interface iPoetryItem {
  id: number,
  title: string,
  text: string,
  author:string,
  photo: string,
}
//诗歌数组
const poetryList= ref<iPoetryItem[]>([
  {
    id: 0,
    title: '静夜思',
    text: '',
    author:'李白',
    photo: test1,
  },
])
const dialogVisible = ref(false)
const nowPoetry = ref<iPoetryItem>(
  {
    id: 0,
    title: '静夜思',
    text: '床前明月光,疑是地上霜。举头望明月,低头思故乡。',
    author:'李白',
    photo: test1,
  },
)
const handleOpen = (item: iPoetryItem) => {
  nowPoetry.value = item
  dialogVisible.value = true
}
onMounted(()=>{
  handleGetPoetry()
})
</script>

<template>
  <div class="poetryBox">

    <section v-for="item of poetryList" :key="item.id" class="card" @click="handleOpen(item)">
      <img :src="item.photo" alt="">
      <span>{{ item.title }}</span>
    </section>

    <el-dialog v-model="dialogVisible" width="500">
      <section class="dialogBox">
        <img :src="nowPoetry.photo" alt="">
        <h4>{{ nowPoetry.title }}</h4>
        <span>{{ nowPoetry.author }}</span>
        <span>{{ nowPoetry.text }}</span>
      </section>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Close</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<style lang="less" scoped>
.poetryBox {
  width: 100%;
  box-sizing: border-box;
  min-width: 750px;
  min-height: 100vh;
  padding-top: 100px;
  padding-left: 40px;
  padding-right: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: flex-start;

  .card {
    width: 320px;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    img {
      width: 320px;
      height: 200px;
      border-radius: 5px;
    }

    span {
      display: block;
      margin-top: 5px;
    }
  }
  .dialogBox{
    width: 400px;
    img{
      width: 320px;
      height: 200px;
    }
    span{
      display: block;
    }
  }
}
</style>