"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import {
    IconDashboard,
    IconUser,
    IconCalendar,
    IconClipboardText,
    IconReportAnalytics,
} from "@tabler/icons-react";

import { NavMain } from "@/components/auth-sidebar/nav-main";
import { NavUser } from "@/components/auth-sidebar/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigation } from "@/provider/nav-provider";
import fhLogo from "@/public/fhLogo.svg";
import { User } from "@/interface";
import supabase from "@/lib/supabase";
import { ModeToggle } from "../mode-toggle";

const navConfig = {
    doctor: [
        { title: "Dashboard", url: "/doctor/dashboard", icon: IconDashboard },
        {
            title: "Appointments",
            url: "/doctor/appointments",
            icon: IconCalendar,
        },
        { title: "Patients", url: "/doctor/patients", icon: IconUser },
        {
            title: "Prescriptions",
            url: "/doctor/prescriptions",
            icon: IconClipboardText,
        },
    ],
    staff: [
        { title: "Dashboard", url: "/staff/dashboard", icon: IconDashboard },
        { title: "Patient", url: "/staff/patients", icon: IconUser },
        {
            title: "Appointments",
            url: "/staff/appointments",
            icon: IconCalendar,
        },
        {
            title: "Medicines",
            url: "/staff/medicines",
            icon: IconReportAnalytics,
        },
    ],
    admin: [
        { title: "Dashboard", url: "/staff/dashboard", icon: IconDashboard },
        { title: "Patient", url: "/staff/patients", icon: IconUser },
        {
            title: "Appointments",
            url: "/staff/appointments",
            icon: IconCalendar,
        },
        {
            title: "Medicines",
            url: "/staff/medicines",
            icon: IconReportAnalytics,
        },
        {
            title: "Users",
            url: "/admin/users",
            icon: IconUser,
        },
    ],
};

export function AppSidebar() {
    const { setActiveTitle } = useNavigation();
    const [user, setUser] = React.useState<User | null>(null);
    const [mainNav, setMainNav] = React.useState(navConfig.doctor);

    React.useEffect(() => {
        const fetchUser = async () => {
            const userData = sessionStorage.getItem("user");

            if (!userData) return;

            const parsedUser = JSON.parse(userData);
            const userId = parsedUser.id;
            const role =
                parsedUser.role === "staff"
                    ? "staff"
                    : parsedUser.role === "admin"
                    ? "admin"
                    : "doctor";

            let profileData;

            if (role === "staff" || role === "admin") {
                const { data, error } = await supabase
                    .from("fh_staffs")
                    .select("full_name, email, phone, address")
                    .eq("user_id", userId)
                    .single();

                if (error) {
                    console.error(
                        "Error fetching staff profile:",
                        error.message
                    );
                    return;
                }

                profileData = data;
            } else {
                const { data, error } = await supabase
                    .from("fh_doctors")
                    .select("full_name, email, phone, address")
                    .eq("user_id", userId)
                    .single();

                if (error) {
                    console.error(
                        "Error fetching doctor profile:",
                        error.message
                    );
                    return;
                }

                profileData = data;
            }

            setUser({
                username: parsedUser.username || parsedUser.id || "unknown",
                role,
                profile: {
                    full_name: profileData?.full_name || "Unknown User",
                    email: profileData?.email || "N/A",
                    phone: profileData?.phone || "",
                    address: profileData?.address || "",
                    avatar: parsedUser.avatar || "",
                },
            });

            setMainNav(
                role === "staff"
                    ? navConfig.staff
                    : role === "admin"
                    ? navConfig.admin
                    : navConfig.doctor
            );
        };

        fetchUser();
    }, []);

    if (!user) return null;

    return (
        <Sidebar collapsible="offcanvas">
            <SidebarHeader className="dark:bg-neutral-900 bg-white">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link href="#">
                                <Image
                                    src={fhLogo}
                                    alt="FataHealth Logo"
                                    width={100}
                                    height={100}
                                    className="!size-5"
                                />
                                <span className="text-base font-semibold">
                                    FataHealth
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="dark:bg-neutral-900 bg-white">
                <NavMain
                    items={mainNav.map((item) => ({
                        ...item,
                        onClick: () => setActiveTitle(item.title),
                    }))}
                />
            </SidebarContent>
            <div className="flex justify-between items-center gap-3 px-4 py-3 rounded-lg">
                <span className="text-sm font-medium">Theme</span>
                <ModeToggle />
            </div>

            <SidebarFooter className="dark:bg-neutral-900 bg-white">
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
