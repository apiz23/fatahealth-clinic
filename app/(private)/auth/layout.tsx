import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../../globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/provider/theme-provider";

const poppins = Poppins({
    weight: "500",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FataHealth Login",
    description: "Authentication Fatah Clinic Management System",
    icons: {
        icon: [
            {
                url: "/fhLogo.svg",
                href: "/fhLogo.svg",
            },
        ],
    },
};

export default function PrivateLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${poppins.className} antialiased`}>
                <Toaster richColors />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
