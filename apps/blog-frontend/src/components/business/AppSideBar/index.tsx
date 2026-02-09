'use client'
import { ChevronUp, Home, Inbox, User2, TreePine, Handshake, LogOut, LayoutDashboard, Globe } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { usePathname, useRouter } from "next/navigation"
import { useUserStore } from "@/store/user"
import { useEffect, useState } from "react"
import { ModeToggle } from "../../my-ui/ThemeMode"
import Link from "next/link"

const items = [
    {
        title: "主页",
        url: { frontstage: '/', backstage: '/backstage' },
        icon: Home,
    },
    {
        title: "归档",
        url: { frontstage: '/article', backstage: '/backstage/article' },
        icon: Inbox,
    },
    {
        title: "树洞",
        url: { frontstage: '/treehole', backstage: '/backstage/treehole' },
        icon: TreePine,
    },
    {
        title: "友链",
        url: { frontstage: '/friend', backstage: '/backstage/friend' },
        icon: Handshake,
    },
]

export type AppSidebarType = 'frontstage' | 'backstage'

export function AppSidebar({ type }: { type: AppSidebarType }) {
    const pathname = usePathname()
    const userStore = useUserStore()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <Sidebar 
            collapsible="icon" 
            variant="floating" 
            className="border-none transition-all duration-300"
        >
            {/* 头部装饰 */}
            <SidebarHeader className="py-4 px-2">
                <SidebarGroupLabel className="text-blue-500 dark:text-blue-400 font-black text-xs tracking-widest uppercase opacity-80">
                    Autumn Blog
                </SidebarGroupLabel>
            </SidebarHeader>

            <SidebarContent className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border-y border-white/20 dark:border-white/5">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const targetUrl = type === 'frontstage' ? item.url.frontstage : item.url.backstage;
                                // 精确匹配激活逻辑
                                const isActive = pathname === targetUrl || (targetUrl !== '/' && pathname.startsWith(targetUrl));

                                return (
                                    <SidebarMenuItem key={item.title} className="mb-1">
                                        <SidebarMenuButton 
                                            asChild 
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className={`
                                                transition-all duration-200 rounded-xl
                                                ${isActive 
                                                    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]" 
                                                    : "hover:bg-white/40 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400"}
                                            `}
                                        >
                                            <Link href={targetUrl}>
                                                <item.icon className={isActive ? "scale-110" : ""} />
                                                <span className="font-medium">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border-t border-white/20 dark:border-white/5 p-2">
                <SidebarMenu className="gap-2">
                    {/* 主题切换 */}
                    <SidebarMenuItem className="flex justify-center py-1">
                        <ModeToggle />
                    </SidebarMenuItem>

                    {/* 用户操作 */}
                    <SidebarMenuItem>
                        {mounted && userStore.isLogin() ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton className="h-11 rounded-xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-sm transition-all hover:shadow-md">
                                        <User2 className="text-blue-500" />
                                        <span className="truncate font-semibold text-gray-700 dark:text-gray-200">
                                            {userStore.user?.username}
                                        </span>
                                        <ChevronUp className="ml-auto opacity-50 w-4 h-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="right"
                                    align="end"
                                    className="w-48 p-2 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-white/20 dark:border-white/5 shadow-2xl"
                                >
                                    <DropdownMenuItem onClick={() => userStore.logout()} className="rounded-xl text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                                        <LogOut className="mr-2 w-4 h-4" />
                                        <span>退出登录</span>
                                    </DropdownMenuItem>
                                    
                                    {type === 'frontstage' && userStore.ownerToken && (
                                        <DropdownMenuItem onClick={() => router.push('/backstage')} className="rounded-xl focus:bg-blue-500 focus:text-white cursor-pointer mt-1">
                                            <LayoutDashboard className="mr-2 w-4 h-4" />
                                            <span>管理后台</span>
                                        </DropdownMenuItem>
                                    )}
                                    
                                    {type === 'backstage' && (
                                        <DropdownMenuItem onClick={() => router.push('/')} className="rounded-xl focus:bg-blue-500 focus:text-white cursor-pointer mt-1">
                                            <Globe className="mr-2 w-4 h-4" />
                                            <span>返回前台</span>
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <SidebarMenuButton 
                                onClick={() => router.push('/login')}
                                className="h-11 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 flex justify-center transition-all active:scale-95"
                            >
                                <User2 />
                                <span className="font-bold">登录</span>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}