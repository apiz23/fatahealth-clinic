// app/staff/layout.tsx (or similar)

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../../globals.css";
import { Toaster } from "sonner";
import { NavigationProvider } from "@/provider/nav-provider";
import { AppSidebar } from "@/components/auth-sidebar/app-sidebar";
import { SiteHeader } from "@/components/auth-sidebar/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SessionProvider } from "@/provider/session-provider";

const poppins = Poppins({
    weight: "500",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FataHealth - Staff",
    description: "Doctor Account",
    icons: {
        icon: [
            {
                url: "/fhLogo.svg",
                href: "/fhLogo.svg",
            },
        ],
    },
};

export default function StaffLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`${poppins.className} antialiased`}>
            <Toaster richColors />
            <SidebarProvider className="dark:bg-neutral-900">
                <NavigationProvider>
                    <AppSidebar />
                    <SidebarInset className="rounded-2xl bg-neutral-200 dark:bg-black m-2">
                        <SiteHeader />
                        <div className="p-6">
                            <SessionProvider>{children}</SessionProvider>
                        </div>
                    </SidebarInset>
                </NavigationProvider>
            </SidebarProvider>
        </div>
    );
}
