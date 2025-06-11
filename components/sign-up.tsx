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

export function SignUpForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const { data: user, error } = await supabase
				.from("hs_users")
				.select("id, email, password")
				.eq("email", email)
				.single();

			if (error || !user) {
				throw new Error("Invalid email or password");
			}

			if (password !== user.password) {
				throw new Error("Invalid email or password");
			}

			sessionStorage.setItem("userId", user.id);

			toast.success("Login successful!");
			router.replace("/home");
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message || "Login failed");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">FataHealth</CardTitle>
					<CardDescription>Receptionist Authentication</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleEmailLogin}>
						<div className="grid gap-6">
							<div className="grid gap-6">
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="you@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										disabled={isLoading}
									/>
								</div>
								<div className="grid gap-2">
									<div className="flex items-center">
										<Label htmlFor="password">Password</Label>
									</div>
									<Input
										id="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										disabled={isLoading}
										placeholder="*********"
									/>
								</div>
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? "Signing in..." : "Sign Up to HealthSync"}
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
