import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CMD } from "@/components/cmd";
import { ThemeProvider } from "@/provider/theme-provider";

const poppins = Poppins({
    weight: "500",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FataHealth",
    description: "Fatah Clinic Management System",
    icons: {
        icon: [
            {
                url: "/fhLogo.svg",
                href: "/fhLogo.svg",
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${poppins.className} antialiased`}>
                <Toaster richColors />
                <CMD />
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
