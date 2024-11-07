import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: MainView,
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: '/articles',
          name: 'articles',
          component: () => import('@/views/ArticlesView.vue'),
        },
        {
          path: '/moments',
          name: 'moments',
          component: () => import('@/views/MomentsView.vue'),
        },
        {
          path: '/messages',
          name: 'messages',
          component: () => import('@/views/MessagesView.vue'),
        },
        {
          path: '/poetry',
          name: 'poetry',
          component: () => import('@/views/PoetryView.vue'),
        },
        {
          path:'/friends',
          name:'friends',
          component: () => import('@/views/FriendsView.vue'),
        },
        {
          path:'/show/:id',
          name:'show',
          component: () => import('@/views/ArticleItemView.vue'),
        }
      ]
    },
  ]
})

export default router
