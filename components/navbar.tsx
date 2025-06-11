"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

type Role = "doctor" | "staff";

interface NavbarProps {
	role: Role;
}

export const Navbar = ({ role }: NavbarProps) => {
	const [menuOpen, setMenuOpen] = useState(false);

	const commonLinks = [
		{ name: "Dashboard", href: "/dashboard" },
		{ name: "Patients", href: "/patients" },
	];

	const doctorLinks = [
		{ name: "Appointments", href: "/appointments" },
		{ name: "Prescriptions", href: "/prescriptions" },
	];

	const staffLinks = [
		{ name: "Schedule", href: "/schedule" },
		{ name: "Billing", href: "/billing" },
	];

	const linksToShow =
		role === "doctor"
			? [...commonLinks, ...doctorLinks]
			: [...commonLinks, ...staffLinks];

	return (
		<nav className="bg-blue-700 text-white p-4 shadow-md">
			<div className="max-w-7xl mx-auto flex justify-between items-center">
				<div className="text-xl font-semibold">Clinic System</div>
				<Button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
					<Menu />
				</Button>
				<ul className="hidden md:flex gap-6">
					{linksToShow.map((link) => (
						<li key={link.name}>
							<a href={link.href} className="hover:underline">
								{link.name}
							</a>
						</li>
					))}
				</ul>
			</div>
			{menuOpen && (
				<ul className="md:hidden mt-2 flex flex-col gap-2 px-4">
					{linksToShow.map((link) => (
						<li key={link.name}>
							<a href={link.href} className="block py-1">
								{link.name}
							</a>
						</li>
					))}
				</ul>
			)}
		</nav>
	);
};
