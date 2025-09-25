
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full relative">
                    <SidebarTrigger className="fixed top-0 z-[99]"/>
                    {children}
                </main>
            </SidebarProvider>
        </>
    )
}
