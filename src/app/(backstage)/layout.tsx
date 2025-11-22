
import { SidebarTrigger } from "@/components/ui/sidebar"
import AuthGuard from "@/components/business/AuthGuard"
import { AppSidebar } from "@/components/business/AppSideBar"
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <AppSidebar type={'backstage'} />
            <main className="w-full relative">
                <SidebarTrigger className="fixed top-0 z-[99]" />
                <AuthGuard>{children}</AuthGuard>
            </main>
        </>
    )
}
