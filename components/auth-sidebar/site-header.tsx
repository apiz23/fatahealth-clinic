"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigation } from "@/provider/nav-provider";
import { Button } from "../ui/button";
import Link from "next/link";

export function SiteHeader() {
    const { activeTitle } = useNavigation();

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) border-b border-neutral-700">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 py-2">
                <SidebarTrigger className="-ml-1 md:w-fit w-10 md:h-fit h-10" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4 border-r border-black dark:border-neutral-700"
                />
                <h1 className="text-base font-medium">{activeTitle}</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button
                        variant="ghost"
                        asChild
                        size="sm"
                        className="hidden sm:flex"
                    >
                        <Link
                            href="https://github.com/apiz23/fatahealth-clinic"
                            rel="noopener noreferrer"
                            target="_blank"
                            className="dark:text-foreground"
                        >
                            GitHub
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
