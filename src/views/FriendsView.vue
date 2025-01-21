<script setup lang="ts">
//导入vue相关api
import { ref, onMounted, nextTick, watch } from 'vue'
//导入asset仓库
import { useAssetStore } from '@/stores/asset'
const { _options } = useAssetStore()
//导入ElementPlus相关组件
import { ElMessage, ElImage, ElLoading } from 'element-plus'
//导入默认头像
import user from '@/assets/user.png'
//导入friends相关接口
import { getFriends,postFriend,getNotice } from '@/services/apis/friends'
//导入类型
import type { iFriendItem,iNotice } from '@/types'
//朋友列表
const friendsList = ref<iFriendItem[]>([])
/**
 * 处理朋友图像加载失败
 * @param item 接收一个朋友类
 */
const onError = (item: iFriendItem) => {
  item.userHeadPortrait = user
}
/**
 * 获取朋友列表
 */
const handleGetFriends = async () => {
  const res = await getFriends()
  if (res.data.code === 200) {
    friendsList.value = res.data.data
    friendsList.value.forEach((item) => {
      item.loading = true
    })
  }
}
const handleGetNotice = async () => {
  const res = await getNotice()
  if (res.data.code === 200) {
    aboutList.value = res.data.data
  }
}
//公告
const aboutList = ref<iNotice[]>([
  {
    id:0,
    notice:'下面申请友链'
  }
])
/**
 * 跳转到朋友的博客
 * @param item 接收一个朋友类
 */
const handleGoPage = (item: iFriendItem) => {
  window.open(item.url, '_blank')
}
/**
 * 图片加载完成
 * @param item 朋友类
 */
const onImageLoad = (item: iFriendItem) => {
  item.loading = false
}
const dialogVisible = ref(false)

const avatarModel = ref(true)
const avatar = ref('')
const name = ref('')
const label = ref('')
const url = ref('')
/**
 * 选择头像
 * @param event 
 */
const handleChooseUserHeadPortrait = (event: any) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      avatar.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  } else {
    ElMessage.error('请选择一张图片')
  }
}
watch(avatarModel, () => {
  avatar.value = ''
})
const handleApply =async () => {
  try{
    if (!avatar.value || !name.value || !label.value || !url.value) {
      ElMessage.error('请填写完整信息')
    }
    const res =await postFriend(
      avatar.value,
      name.value,
      label.value,
      url.value,
      avatarModel.value
    )
    if (res.data.code === 200) {
      ElMessage({
        message: '申请成功,请联系管理员进行审核',
        type: 'success',
      })
      dialogVisible.value = false
    } else {
      ElMessage.error('申请失败')
    }
  }catch(err){
    ElMessage.error('申请失败')
  }
  
}
onMounted(async () => {
  //初始化
  const loadingInstance = ElLoading.service(_options)
  try {
    await handleGetFriends()
    await handleGetNotice()
  } catch (error) {
    ElMessage.error('加载资源失败')
    console.log(error)
  } finally {
    nextTick(() => {
      setTimeout(() => {
        loadingInstance.close()
      }, 0)
    })
  }

})
</script>

<template>
  <div class="friendsBox">
    <section class="cardBox">
      <div class="section">
        <h2>友链站点</h2>
        <ul class="cardList">
          <li v-for="item of friendsList" :key="item.id" class="cardItem" @click="handleGoPage(item)">
            <el-image :src="item.userHeadPortrait || user" alt="头像" fit="cover" lazy class="user" @error="onError(item)"
              v-loading="item.loading" @load="onImageLoad(item)" />
            <div class="info">
              <h4>{{ item.name }}</h4>
              <span>{{ item.label }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="section">
        <h2>公告</h2>
        <ul class="aboutList">
          <li v-for="item of aboutList" :key="item.id" class="aboutItem">{{ item.notice }}</li>
        </ul>
      </div>
      <div class="section">
        <h2>申请友链</h2>
        <el-button type="primary" @click="dialogVisible = true">申请</el-button>
        <el-dialog v-model="dialogVisible" title="申请友链" width="90%">
          <form action="" class="friendForm">
            <div class='formDiv'>
              <h3>头像</h3>
              <el-switch v-model="avatarModel" class="mb-2" active-text="上传链接" inactive-text="上传文件" />
              <el-input v-model="avatar" style="width: 240px" placeholder="头像地址" v-if='avatarModel' />
              <div class="user" v-else>
                <label for="choose">
                  <el-image style="width: 100%; height: 100%" :src="avatar" v-if="!!avatar"
                    :preview-src-list="[avatar]" />
                  <div class="addUser" v-else>
                    <input type="file" accept="image/*" @change="(e) => handleChooseUserHeadPortrait(e)" id="choose"
                      :style="{ display: 'none' }">
                    +
                  </div>
                </label>
                <el-button @click="() => { avatar = '' }" :style="{marginTop:'10px'}">去除头像</el-button>
              </div>
            </div>
            <div class='formDiv'>
              <h3>站点名称</h3>
              <el-input v-model="name" style="width: 240px" placeholder="站点名称" />
            </div>
            <div class='formDiv'>
              <h3>站点简介</h3>
              <el-input v-model="label" style="width: 240px" placeholder="站点简介" />
            </div>
            <div class='formDiv'>
              <h3>站点地址</h3>
              <el-input v-model="url" style="width: 240px" placeholder="站点链接" />
            </div>
          </form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="handleApply">
                提交
              </el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </section>
  </div>
</template>

<style lang="less" scoped>
@screen-middle-mobile: 960px;

.friendsBox {
  .standardBox;
  background: var(--friend-background-color);
  color: var(--friend-text-color);

  @media screen and (max-width:@screen-middle-mobile) {
    .standardBoxChange;
  }

  .cardBox {
    .standardWidth;
    .innerShadow;
    background-color: var(--friend-background-fill-color);

    @media screen and (max-width:@screen-middle-mobile) {
      width: 100%;
    }

    .section {
      margin-bottom: 20px;

      .cardList {
        width: 100%;
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: start;

        .cardItem {
          .size(200px, 100px);
          margin: 0px 0px 20px 20px;
          background-color: var(--friend-card-background-color);
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-radius: 10px;
          box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
          /* 添加盒子阴影 */
          cursor: pointer;
          transform: scale(1.0);
          transition: all 1s ease;

          &:hover {
            transform: scale(1.1);
          }

          .user {
            .avatar(50px);

            &:hover {
              animation-name: revolve;
              animation-duration: 1s;
              animation-timing-function: linear;
              /* 可选，确保动画平滑 */
            }
          }

          .info {
            width: 120px;

            h4 {
              display: block;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            span {
              display: block;
              font-size: 12px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }

      .aboutList {
        width: 100%;

        .aboutItem {
          margin-bottom: 10px;
        }
      }
    }

  }
}

@keyframes revolve {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
.friendForm{
  display: flex;
  flex-direction: column;
  height:60vh;
  justify-content: space-around;
  min-height:500px;
  .formDiv {
      display: flex;
      flex-direction: column;
  
      .user {
        .avatar(85px);
        border: 1px solid black;
  
        label {
          display: block;
          .size(100%, 100%);
          border-radius: 85px;
        }
  
        div,
        img {
          .size(100%, 100%);
          border-radius: 85px;
        }
  
        div {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
}

</style>