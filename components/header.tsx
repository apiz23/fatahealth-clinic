"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import fhLogo from "@/public/fhLogo.svg";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";

export const HeroHeader = () => {
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header>
            <nav
                className={cn(
                    "fixed z-50 w-full transition-all duration-300",
                    isScrolled
                        ? "bg-background/90 border-b border-border/50 backdrop-blur-md"
                        : "bg-background/50"
                )}
            >
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo and Brand */}
                        <div className="flex items-center">
                            <Link
                                href="/"
                                className="flex items-center gap-3"
                                aria-label="Home"
                            >
                                <Image
                                    src={fhLogo}
                                    alt="FataHealth Clinic Logo"
                                    className="h-8 w-8"
                                    priority
                                />
                                <span className="text-xl font-semibold tracking-tight text-foreground">
                                    FataHealth Clinic
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center gap-6 md:flex">
                            <ModeToggle />
                            <Button
                                asChild
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow transition-colors"
                            >
                                <Link href="/appointment">
                                    Book Appointment
                                </Link>
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center gap-2 md:hidden">
                            <ModeToggle />
                            <Drawer direction="bottom">
                                <DrawerTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-5 w-5" />
                                        <span className="sr-only">
                                            Open menu
                                        </span>
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent className="w-full rounded-t-2xl bg-background dark:bg-neutral-900 border-t border-border/50">
                                    <DrawerHeader className="text-left">
                                        <DrawerTitle className="text-lg">
                                            FataHealth Clinic Menu
                                        </DrawerTitle>
                                    </DrawerHeader>
                                    <div className="p-4 space-y-4">
                                        <Button
                                            asChild
                                            className="w-full"
                                            size="sm"
                                        >
                                            <Link href="/appointment">
                                                Book Appointment
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            className="w-full"
                                            size="sm"
                                        >
                                            <Link href="/payment">Payment</Link>
                                        </Button>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};
