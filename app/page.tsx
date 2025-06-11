"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import doctor from "@/public/anim/doctor.json";
import Lottie from "lottie-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Stethoscope, HeartPulse, Microscope, PhoneCall } from "lucide-react";
import { HeroHeader } from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
    const specialties = [
        { name: "General Medicine", icon: <Stethoscope className="w-6 h-6" /> },
        { name: "Cardiology", icon: <HeartPulse className="w-6 h-6" /> },
        { name: "Pediatrics", icon: <Microscope className="w-6 h-6" /> },
    ];

    const services = [
        {
            title: "Online Booking",
            description:
                "Book appointments 24/7 through our easy-to-use platform",
            icon: <PhoneCall className="w-8 h-8 mb-4 text-primary" />,
        },
        {
            title: "Emergency Care",
            description:
                "Immediate medical attention for urgent health concerns",
            icon: <HeartPulse className="w-8 h-8 mb-4 text-primary" />,
        },
        {
            title: "Health Checkups",
            description: "Comprehensive preventive health screenings",
            icon: <Stethoscope className="w-8 h-8 mb-4 text-primary" />,
        },
    ];

    return (
        <>
            <HeroHeader />
            {/* Hero Section */}
            <section className="overflow-hidden">
                <div className="py-20 md:py-40">
                    <div className="relative z-10 mx-auto max-w-6xl px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-center">
                            <div className="order-1 md:order-2 w-56 h-56 sm:w-fit sm:h-full mx-auto bg-transparent">
                                <Lottie animationData={doctor} loop={true} />
                            </div>

                            <div className="order-2 md:order-1 block md:pt-20">
                                <h1 className="mx-auto space-y-2 text-balance text-4xl font-bold md:text-6xl">
                                    Book Your Appointment With Ease
                                </h1>

                                <p className="text-muted-foreground mx-auto my-6 max-w-2xl text-balance text-xl">
                                    Hassle-free online appointment system to
                                    schedule your clinic visits anytime,
                                    anywhere.
                                </p>

                                <div className="flex flex-col items-center justify-center gap-3 *:w-full sm:flex-row sm:*:w-auto">
                                    <Button asChild size="lg">
                                        <Link href="/appointment">
                                            <span className="text-nowrap">
                                                Book Now!
                                            </span>
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <Link href="/payment">
                                            <span className="text-nowrap">
                                                Settle your payment
                                            </span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Specialties Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900" id="specialize">
                <div className="mx-auto max-w-6xl px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Our Specialties
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {specialties.map((specialty, index) => (
                            <Card
                                key={index}
                                className="text-center p-6 hover:shadow-lg transition-shadow"
                            >
                                <CardHeader className="flex justify-center">
                                    <div className="mx-auto p-3 rounded-full bg-primary/10">
                                        {specialty.icon}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <h3 className="text-xl font-semibold">
                                        {specialty.name}
                                    </h3>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20" id="services">
                <div className="mx-auto max-w-6xl px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Our Services
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <Card
                                key={index}
                                className="p-8 text-center hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-center">
                                    {service.icon}
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                        {service.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        {service.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900" id="about">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                About Our Clinic
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                We are committed to providing high-quality
                                healthcare services with a patient-centered
                                approach. Our team of experienced professionals
                                ensures you receive the best medical care.
                            </p>
                            <Button asChild size="lg">
                                <Link href="/about">Learn More</Link>
                            </Button>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-64 h-64 bg-primary/10 rounded-full flex items-center justify-center">
                                <Stethoscope className="w-16 h-16 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
