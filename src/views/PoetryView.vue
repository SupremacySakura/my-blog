<script setup lang="ts">
//导入Vue相关API
import { ref, onMounted, nextTick } from 'vue'
//导入测试图片
import test1 from '@/assets/test1.jpg'
import backgroundImg from '@/assets/backgroundImg.jpg'
//导入ElementPlus相关组件
import { ElImage, ElLoading } from 'element-plus'
//导入接口
import { getPoetry } from '@/services/apis/poetry'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options } = useAssetStore()
/**
 * 获取诗歌列表,并给poetryList赋值
 */
const handleGetPoetry = async () => {
  const res = await getPoetry()
  if (+res.data.code === 200) {
    poetryList.value = res.data.data
    poetryList.value.forEach((item) => {
      if (!item.photo) {
        item.photo = test1
      }
    })
  }
}
//定义是个类型接口
interface iPoetryItem {
  id: number,
  title: string,
  text: string,
  author: string,
  photo: string,
}
//诗歌数组
const poetryList = ref<iPoetryItem[]>([
  {
    id: 0,
    title: '静夜思',
    text: '',
    author: '李白',
    photo: test1,
  },
])
//控制诗歌显示隐藏
const dialogVisible = ref(false)
//选中诗歌
const nowPoetry = ref<iPoetryItem>(
  {
    id: 0,
    title: '静夜思',
    text: '',
    author: '李白',
    photo: test1,
  },
)
/**
 * 打开所选诗歌
 * @param item 接收诗歌项
 */
const handleOpen = (item: iPoetryItem) => {
  nowPoetry.value = item
  dialogVisible.value = true
}
const onError = (item: iPoetryItem) => {
  item.photo = test1
}
onMounted(async () => {
  const loadingInstance = ElLoading.service(_options)
  //初始化
  await handleGetPoetry()
  nextTick(() => {
    setTimeout(() => {
      loadingInstance.close()
    }, 0)
  })
})
</script>

<template>
  <div class="poetryBox">
    <img :src="backgroundImg" alt="" class="background-img">
    <!-- 诗歌列表 -->
    <section v-for="item of poetryList" :key="item.id" class="card" @click="handleOpen(item)">
      <el-image :src="item.photo" alt="封面" class="cover" fit="cover" lazy @error="onError(item)"></el-image>
      <span>{{ item.title }}</span>
    </section>
    <!-- 诗歌展示弹窗 -->
    <el-dialog v-model="dialogVisible" width="500">
      <section class="dialogBox">
        <el-image :src="nowPoetry.photo" alt="封面" class="cover" fit="cover" lazy></el-image>
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
  background-color: rgba(247, 247, 247, 1);
  .background-img{
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 0;
    left: 0;
    top: 0;
  }
  .card {
    width: 320px;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    position: relative;
    .cover {
      width: 320px;
      height: 200px;
      border-radius: 5px;
    }

    span {
      display: block;
      margin-top: 5px;
    }
  }

  .dialogBox {
    width: 400px;

    .cover {
      width: 320px;
      height: 200px;
    }

    span {
      display: block;
    }
  }
}
</style>