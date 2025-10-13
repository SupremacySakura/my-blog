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

// Menu items.
const items = [
    {
        title: "主页",
        url: "/",
        icon: Home,
    },
    {
        title: "归档",
        url: "/article",
        icon: Inbox,
    },
    {
        title: "树洞",
        url: "/treehole",
        icon: TreePine,
    },
    {
        title: "友链",
        url: "/friend",
        icon: Handshake,
    },
]

export function AppSidebar() {
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
                                    <SidebarMenuButton asChild isActive={item.url === pathname}>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
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
                                {userStore.owner_token && <DropdownMenuItem>
                                    <span onClick={() => router.push('/backstage')}>切换到后台</span>
                                </DropdownMenuItem>}
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