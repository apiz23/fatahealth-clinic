import { SignInForm } from "@/components/sign-in";
import React from "react";
import fhLogo from "@/public/fhLogo.svg";
import Image from "next/image";

export default function page() {
	return (
		<>
			<div className="max-w-3xl mx-auto p-4 pt-10">
				<Image src={fhLogo} alt={"logo"} className="h-32 w-32 mx-auto" />

				<h1 className="scroll-m-20 text-[40px] md:text-[60px] lg:text-[90px] font-extrabold text-center mb-5">
					FataHealth
				</h1>
				<div className="w-full max-w-[500px] mx-auto">
					<SignInForm />
				</div>
			</div>
		</>
	);
}
