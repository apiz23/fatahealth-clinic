"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

export function SignInForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const loginPromise = (async () => {
            try {
                const { data: users, error } = await supabase
                    .from("fh_users")
                    .select("id, email, password, role")
                    .eq("email", email)
                    .single();

                if (error || !users || password !== users.password) {
                    throw new Error("Invalid username or password");
                }

                const role = users.role as "doctor" | "staff";
                type UserProfile = {
                    id: string;
                    full_name: string;
                    phone: string;
                    email: string;
                    address: string;
                };

                type ExtraData =
                    | { staff_id: string }
                    | { doctor_id: string }
                    | object;

                let profile: UserProfile | null = null;
                let extraData: ExtraData = {};

                if (role === "staff") {
                    const { data: staff, error: staffError } = await supabase
                        .from("fh_staffs")
                        .select("id, full_name, phone, email, address")
                        .eq("user_id", users.id)
                        .single();

                    if (staffError || !staff) {
                        throw new Error("Staff profile not found");
                    }

                    profile = staff;
                    extraData = { staff_id: staff.id };
                } else {
                    const { data: doc } = await supabase
                        .from("fh_doctors")
                        .select("id, full_name, phone, email, address")
                        .eq("user_id", users.id)
                        .single();

                    if (!doc) {
                        throw new Error("Doctor profile not found");
                    }

                    profile = doc;
                    extraData = { doctor_id: doc.id };
                }

                const user = {
                    id: users.id,
                    role,
                    profile,
                    ...extraData,
                };

                sessionStorage.setItem("isAuthenticated", "true");
                sessionStorage.setItem("user", JSON.stringify(user));
                sessionStorage.setItem("userRole", role);

                router.replace(`/${role}/dashboard`);

                return { full_name: profile?.full_name || users.email };
            } catch (err) {
                setIsLoading(false);
                throw err;
            } finally {
                setIsLoading(false);
            }
        })();

        toast.promise(loginPromise, {
            loading: "Logging in...",
            success: (d: { full_name: string }) => `Welcome ${d.full_name}`,
            error: "Login failed",
        });
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">FataHealth Admin</CardTitle>
                    <CardDescription>Login Account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="johnDoe12@example.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                        disabled={isLoading}
                                        placeholder="*********"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? "Signing in..."
                                        : "Sign in to FataHealth"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="text-balance text-center text-xs text-muted-foreground">
                By continuing, you agree to HealthSync{"'"}s
                <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-800 underline underline-offset-4"
                >
                    Terms of Service
                </Link>
                and
                <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-800 underline underline-offset-4"
                >
                    Privacy Policy
                </Link>
                .
            </div>
        </div>
    );
}
