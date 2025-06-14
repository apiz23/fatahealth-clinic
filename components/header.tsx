"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import fhLogo from "@/public/fhLogo.svg";
import Image from "next/image";

export const HeroHeader = () => {
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header>
            <nav
                className={cn(
                    "fixed z-20 w-full transition-all duration-300",
                    isScrolled &&
                        "bg-background/75 border-b border-black/5 backdrop-blur-lg"
                )}
            >
                <div className="mx-auto max-w-5xl px-6">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
                        <div className="flex w-full justify-between gap-6 lg:w-auto py-2">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-4"
                            >
                                <Image
                                    src={fhLogo}
                                    alt={"logo"}
                                    className="h-10 w-10"
                                />
                                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                    FataHealth Clinic
                                </h3>
                            </Link>

                            <div className="lg:hidden">
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button>
                                            <Menu />
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle>Menu</DrawerTitle>
                                            <DrawerDescription>
                                                Navigate through our website
                                            </DrawerDescription>
                                        </DrawerHeader>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </div>

                        <div className="hidden w-full flex-wrap items-center justify-end space-y-8 lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0">
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    size="sm"
                                    className="dark:bg-cyan-200 dark:text-neutral-900 dark:hover:bg-cyan-300"
                                >
                                    <Link href="/appointment">
                                        <span className="capitalize">
                                            book your appointment
                                        </span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};
