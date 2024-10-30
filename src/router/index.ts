import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import HomeView from '../views/HomeView.vue'
import ArticlesView from '@/views/ArticlesView.vue'
import MessagesView from '@/views/MessagesView.vue'
import MomentsView from '@/views/MomentsView.vue'
import PoetryView from '@/views/PoetryView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      redirect:'/home',
      component:MainView,
      children:[
        {
          path: '/home',
          name: 'home',
          component: HomeView
        },
        {
          path: '/articles',
          name: 'articles',
          component: ArticlesView
        },
        {
          path: '/moments',
          name: 'moments',
          component: MomentsView
        },
        {
          path: '/messages',
          name: 'messages',
          component: MessagesView
        },
        {
          path: '/poetry',
          name: 'poetry',
          component: PoetryView
        },
      ]
    },
  ]
})

export default router
