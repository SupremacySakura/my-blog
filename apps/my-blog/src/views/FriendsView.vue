<script setup lang="ts">
// 导入vue相关api
import { ref, onMounted } from 'vue'
// 导入仓库
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
const { _checkLogin } = useUserStore()
const { _user } = storeToRefs(useUserStore())
// 导入ElementPlus相关组件
import { ElMessage, ElImage } from 'element-plus'
// 导入默认头像
import user from '@/assets/user.png'
// 导入friends相关接口
import { getFriends, postFriend, getNotice } from '@/services/apis/friends'
// 导入类型
import type { iFriendItem, iNotice } from '@/types'
// 朋友列表
const friendsList = ref<iFriendItem[]>([])
/**
 * 处理朋友图像加载失败
 * @param item 接收一个朋友类
 */
const onError = (item: iFriendItem) => {
  item.user.avatar = user
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
/**
 * 获取公告
 */
const handleGetNotice = async () => {
  const res = await getNotice()
  if (res.data.code === 200) {
    aboutList.value = res.data.data
  }
}
// 公告
const aboutList = ref<iNotice[]>([
  {
    _id: '0',
    notice: '下面申请友链'
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

const name = ref('')
const label = ref('')
const url = ref('')

/**
 * 申请友链
 */
const handleApply = async () => {
  try {
    if (! await _checkLogin()) {
      ElMessage.error('请先登录')
      return
    }
    if (!name.value || !label.value || !url.value) {
      ElMessage.error('请填写完整信息')
      return
    }
    const res = await postFriend(
      _user.value?._id as number,
      name.value,
      label.value,
      url.value,
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
  } catch (err) {
    ElMessage.error('申请失败')
  }

}
onMounted(async () => {
  //初始化
  try {
    await handleGetFriends()
    await handleGetNotice()
  } catch (error) {
    ElMessage.error(`加载资源失败${error}`)
  }
})
</script>

<template>
  <div class="friendsBox">
    <section class="cardBox">
      <div class="section">
        <h2 class="defaultCursor">友链站点</h2>
        <ul class="cardList">
          <li v-for="item of friendsList" :key="item.id" class="cardItem" @click="handleGoPage(item)">
            <el-image :src="item.user.avatar || user" alt="头像" fit="cover" lazy class="user" @error="onError(item)"
              v-loading="item.loading" @load="onImageLoad(item)" />
            <div class="info">
              <h4>{{ item.name }}</h4>
              <span>{{ item.label }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="section">
        <h2 class="defaultCursor">公告</h2>
        <ul class="aboutList">
          <li v-for="item of aboutList" :key="item._id" class="aboutItem">
            <span class=" lineWith">{{ item.notice }}</span>
          </li>
        </ul>
      </div>
      <div class="section">
        <h2 class="defaultCursor">申请友链</h2>
        <el-button type="primary" @click="dialogVisible = true" style="margin-top: 10px;">申请</el-button>
        <el-dialog v-model="dialogVisible" title="申请友链" width="90%">
          <form action="" class="friendForm">
            <div class='formDiv'>
              <h3 class="required">站点名称</h3>
              <el-input v-model="name" style="width: 240px" placeholder="站点名称" />
            </div>
            <div class='formDiv'>
              <h3 class="required">站点简介</h3>
              <el-input v-model="label" style="width: 240px" placeholder="站点简介" />
            </div>
            <div class='formDiv'>
              <h3 class="required">站点地址</h3>
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
@screen-small-mobile: 750px;

.friendsBox {
  .standardBox;
  background: var(--friend-background-color);
  color: var(--friend-text-color);
  transition: background-color 0.3s ease;

  @media screen and (max-width: @screen-middle-mobile) {
    .standardBoxChange;
  }

  .cardBox {
    .standardWidth;
    .innerShadow;
    background-color: var(--friend-background-fill-color);
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

    @media screen and (max-width: @screen-middle-mobile) {
      width: 100%;
      padding: 20px 15px;
    }

    .section {
      margin-bottom: 40px;
      animation: fadeIn 0.6s ease-in-out forwards;

      h2 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 20px;
        position: relative;
        display: block;
        cursor: default;

        &::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 50px;
          height: 3px;
          background: linear-gradient(90deg, var(--friend-text-color), transparent);
          border-radius: 2px;
        }
      }

      .cardList {
        width: 100%;
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 20px;

        .cardItem {
          width: 220px;
          height: 100px;
          background-color: var(--friend-card-background-color);
          display: flex;
          justify-content: flex-start;
          align-items: center;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transform: translateY(0);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          padding: 0 15px;
          position: relative;
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 50%);
            z-index: 1;
            pointer-events: none;
          }

          &:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);

            .user {
              animation: revolve 1s linear;
            }

            .info h4 {
              color: var(--hover-button-background-color);
            }
          }

          .user {
            .avatar(60px);
            border: 3px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            margin-right: 15px;
            flex-shrink: 0;
            transition: transform 0.3s ease;
            z-index: 2;
          }

          .info {
            // flex: 1;
            width: 140px;
            z-index: 2;

            h4 {
              display: block;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 8px;
              transition: color 0.3s ease;
            }

            span {
              display: block;
              font-size: 13px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              opacity: 0.8;
              line-height: 1.4;
            }
          }
        }

        // 添加卡片的淡入动画
        .cardItem {
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
        }

        .cardItem:nth-child(1) {
          animation-delay: 0.1s;
        }

        .cardItem:nth-child(2) {
          animation-delay: 0.15s;
        }

        .cardItem:nth-child(3) {
          animation-delay: 0.2s;
        }

        .cardItem:nth-child(4) {
          animation-delay: 0.25s;
        }

        .cardItem:nth-child(5) {
          animation-delay: 0.3s;
        }

        .cardItem:nth-child(n+6) {
          animation-delay: 0.35s;
        }
      }

      .aboutList {
        width: 100%;
        background-color: var(--friend-card-background-color);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

        .aboutItem {
          font-size: 16px;
          margin: 10px 0;
          cursor: default;
          padding: 10px;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;

          &:hover {
            background-color: rgba(0, 0, 0, 0.05);
            transform: translateX(5px);
          }

          &::before {
            content: '•';
            margin-right: 10px;
            color: var(--hover-button-background-color);
            font-weight: bold;
          }

          span {
            line-height: 1.6;
            position: relative;

            &.lineWith::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 0;
              height: 1px;
              background-color: var(--hover-button-background-color);
              transition: width 0.3s ease;
            }

            &.lineWith:hover::after {
              width: 100%;
            }
          }
        }
      }
    }
  }
}

// 旋转动画
@keyframes revolve {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

// 淡入动画
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

// 上移淡入动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 友链申请表单样式
.friendForm {
  display: flex;
  flex-direction: column;
  min-height: 500px;
  justify-content: space-around;
  padding: 20px 0;

  .formDiv {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 10px;
      color: var(--friend-text-color);

      &.required::after {
        content: '*';
        color: #f56c6c;
        margin-left: 5px;
        font-size: 14px;
      }
    }

    .el-input {
      margin-top: 5px;
    }

    .el-switch {
      margin-bottom: 15px;
    }

    .user {
      .avatar(85px);
      border: 3px solid rgba(0, 0, 0, 0.1);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      margin: 10px 0;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }

      label {
        display: block;
        .size(100%, 100%);
        border-radius: 85px;
        cursor: pointer;
      }

      div,
      img {
        .size(100%, 100%);
        border-radius: 85px;
        object-fit: cover;
      }

      div {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        background-color: rgba(0, 0, 0, 0.05);
      }

      .addUser {
        background-color: rgba(64, 158, 255, 0.1);
        color: var(--hover-button-background-color);
        font-size: 36px;
        transition: all 0.3s ease;

        &:hover {
          background-color: rgba(64, 158, 255, 0.2);
        }
      }

      .el-button {
        margin-top: 10px !important;
        width: 100%;
      }
    }
  }
}

// 对话框底部按钮样式
:deep(.dialog-footer) {
  display: flex;
  justify-content: center;
  gap: 15px;

  .el-button {
    padding: 10px 20px !important;
    border-radius: 8px !important;
    transition: all 0.3s ease !important;

    &:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
    }

    &:first-child {
      background-color: #f5f7fa !important;
      border-color: #e4e7ed !important;
    }

    &:last-child {
      background-color: var(--hover-button-background-color) !important;
      border-color: var(--hover-button-background-color) !important;
      color: black !important;
    }
  }
}

// 对话框样式
:deep(.el-dialog) {
  border-radius: 15px !important;
  overflow: hidden !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;

  .el-dialog__header {
    padding: 20px !important;
    margin: 0 !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;

    .el-dialog__title {
      font-size: 20px !important;
      font-weight: 600 !important;
    }
  }

  .el-dialog__body {
    padding: 20px !important;
  }

  .el-dialog__footer {
    padding: 15px 20px 20px !important;
    border-top: 1px solid rgba(0, 0, 0, 0.05) !important;
  }
}

.defaultCursor {
  cursor: default;
}
</style>