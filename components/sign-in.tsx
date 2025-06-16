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
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

type UserRole = "doctor" | "staff" | "admin";

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

                const role = users.role as UserRole;
                type UserProfile = {
                    id: string;
                    full_name: string;
                    phone: string;
                    address: string;
                };

                type ExtraData =
                    | { staff_id: string }
                    | { doctor_id: string }
                    | object;

                let profile: UserProfile | null = null;
                let extraData: ExtraData = {};

                if (role === "staff" || role === "admin") {
                    const { data: staff, error: staffError } = await supabase
                        .from("fh_staffs")
                        .select("id, full_name, phone, address")
                        .eq("user_id", users.id)
                        .single();

                    if (staffError || !staff) {
                        throw new Error("Staff profile not found");
                    }

                    profile = staff;
                    extraData = { staff_id: staff.id };
                } else if (role === "doctor") {
                    const { data: doc, error: docError } = await supabase
                        .from("fh_doctors")
                        .select("id, full_name, phone, address")
                        .eq("user_id", users.id)
                        .single();

                    if (docError || !doc) {
                        throw new Error("Doctor profile not found");
                    }

                    profile = doc;
                    extraData = { doctor_id: doc.id };
                } else {
                    throw new Error("Invalid user role");
                }

                const user = {
                    id: users.id,
                    role,
                    email,
                    profile,
                    ...extraData,
                };

                sessionStorage.setItem("isAuthenticated", "true");
                sessionStorage.setItem("user", JSON.stringify(user));
                sessionStorage.setItem("userRole", role);

                const redirectPath =
                    role === "admin"
                        ? "/staff/dashboard"
                        : `/${role}/dashboard`;
                router.replace(redirectPath);

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
                    <CardTitle className="text-2xl">FataHealth</CardTitle>
                    <CardDescription>Login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
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
        </div>
    );
}
