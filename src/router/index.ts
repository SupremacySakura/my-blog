import { createRouter, createWebHistory } from 'vue-router'
// 导入仓库
import { useUserStore } from '@/stores/user'
// 导入路由
import { routes } from './route'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { left: 0, top: 0 };  // 返回符合 ScrollPosition 的类型
    }
  }
})
router.beforeEach((to, from, next) => {
  const { _checkLogin } = useUserStore()  // 确保每次获取最新状态
  if (to.name === 'user' && !_checkLogin()) {
    // 如果访问 user 页面但未登录，则跳转到 login 页面
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
