import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../../globals.css";
import { Toaster } from "sonner";
import { NavigationProvider } from "@/provider/nav-provider";
import { AppSidebar } from "@/components/auth-sidebar/app-sidebar";
import { SiteHeader } from "@/components/auth-sidebar/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SessionProvider } from "@/provider/session-provider";
import { ThemeProvider } from "@/provider/theme-provider";

const poppins = Poppins({
    weight: "500",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FataHealth - Doctor",
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

export default function DoctorLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.className} antialiased`}>
                <Toaster richColors />
                <SidebarProvider>
                    <NavigationProvider>
                        <AppSidebar />
                        <SidebarInset>
                            <SiteHeader />
                            <div className="p-6">
                                <ThemeProvider	
                                    attribute="class"
                                    defaultTheme="dark"
                                    enableSystem
                                    disableTransitionOnChange
                                >
                                    <SessionProvider>
                                        {children}
                                    </SessionProvider>
                                </ThemeProvider>
                            </div>
                        </SidebarInset>
                    </NavigationProvider>
                </SidebarProvider>
            </body>
        </html>
    );
}
