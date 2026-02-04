'use client'
import { ChevronUp, Home, Inbox, User2, TreePine, Handshake } from "lucide-react"
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

// Menu items.
const items = [
    {
        title: "主页",
        url: {
            frontstage: '/',
            backstage: '/backstage',
        },
        icon: Home,
    },
    {
        title: "归档",
        url: {
            frontstage: '/article',
            backstage: '/backstage/article',
        },
        icon: Inbox,
    },
    {
        title: "树洞",
        url: {
            frontstage: '/treehole',
            backstage: '/backstage/treehole',
        },
        icon: TreePine,
    },
    {
        title: "友链",
        url: {
            frontstage: '/friend',
            backstage: '/backstage/friend',
        },
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
        <Sidebar collapsible="icon" variant="floating">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>余心知秋的博客</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={type === 'frontstage' && pathname.endsWith(item.url.frontstage) || type === 'backstage' && pathname.endsWith(item.url.backstage)}>
                                        <Link href={type === 'frontstage' ? item.url.frontstage : item.url.backstage}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <ModeToggle></ModeToggle>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        {mounted && userStore.isLogin() && <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> <span className="whitespace-nowrap">{userStore.user?.username}</span>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className=""
                            >
                                <DropdownMenuItem>
                                    <span onClick={() => userStore.logout()}>Sign out</span>
                                </DropdownMenuItem>
                                {type === 'frontstage' && userStore.ownerToken && <DropdownMenuItem>
                                    <span onClick={() => router.push('/backstage')}>切换到后台</span>
                                </DropdownMenuItem>}
                                {type === 'backstage' && <DropdownMenuItem> <span onClick={() => router.push('/')}>切换到前台</span></DropdownMenuItem>}
                            </DropdownMenuContent>
                        </DropdownMenu>}
                        {mounted && !userStore.isLogin() && (<SidebarMenuButton asChild>
                            <span onClick={() => { router.push('/login') }}>
                                <User2 />
                                <span>登录</span>
                            </span>
                        </SidebarMenuButton>)}
                    </SidebarMenuItem>

                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}