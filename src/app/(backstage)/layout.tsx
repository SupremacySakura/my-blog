
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { BackstageSidebar } from "@/components/backstage-sidebar"
import AuthGuard from "@/components/AuthGuard/AuthGuard"
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <SidebarProvider>
                <BackstageSidebar />
                <main className="w-full relative">
                    <SidebarTrigger className="fixed top-0 z-[99]" />
                    <AuthGuard>{children}</AuthGuard>
                </main>
            </SidebarProvider>

        </>
    )
}
