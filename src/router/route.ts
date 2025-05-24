import type { RouteRecordRaw } from "vue-router";
import MainView from '@/views/MainView.vue'
import type { iTabBarItem } from "@/types";
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home',
        component: MainView,
        children: [
            {
                path: '/user',
                name: 'user',
                component: () => import('@/views/UserView.vue'),
                meta: {
                    id: 8,
                    isNeedLogin: true,
                    text: '个人'
                }
            },
            {
                path: '/home',
                name: 'home',
                component: () => import('@/views/HomeView.vue'),
                meta: {
                    id: 1,
                    text: '首页'
                }
            },
            {
                path: '/articles',
                name: 'articles',
                component: () => import('@/views/ArticlesView.vue'),
                meta: {
                    id: 2,
                    text: '文章'
                }
            },
            {
                path: '/moments',
                name: 'moments',
                component: () => import('@/views/MomentsView.vue'),
                meta: {
                    id: 3,
                    text: '动态'
                }
            },
            {
                path: '/messages',
                name: 'messages',
                component: () => import('@/views/MessagesView.vue'),
                meta: {
                    id: 4,
                    text: '留言板'
                }
            },
            {
                path: '/friends',
                name: 'friends',
                component: () => import('@/views/FriendsView.vue'),
                meta: {
                    id: 5,
                    text: '朋友们'
                }
            },
            {
                path: '/show/:id',
                name: 'show',
                component: () => import('@/views/ArticleItemView.vue'),
            },
            {
                path: '/resources',
                name: 'resources',
                component: () => import('@/views/ResourcesView.vue'),
                meta: {
                    id: 7,
                    text: '资源'
                }
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: {
            text: '登录'
        }
    },
]
const getTabBarList = (routes: RouteRecordRaw[]): iTabBarItem[] => {
    const res = []
    for (let i = 0; i < routes.length; i++) {
        let item = routes[i]
        if (item.meta && item.meta.id) {
            res.push({
                id: item.meta.id,
                text: item.meta.text,
                path: item.path,
                isNeedLogin: item.meta.isNeedLogin
            } as iTabBarItem)
        }
    }
    return res
}
const dealRoutes = getTabBarList(routes[0].children as RouteRecordRaw[])
export {
    routes,
    dealRoutes
}