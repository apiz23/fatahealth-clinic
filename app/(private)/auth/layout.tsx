import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../../globals.css";

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

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className={`${poppins.className}`}>{children}</div>;
}
