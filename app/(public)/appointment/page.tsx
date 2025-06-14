"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeftCircle, CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import fhLogo from "@/public/fhLogo.svg";
import Link from "next/link";

export default function AppointmentPage() {
    const [date, setDate] = useState<Date | undefined>(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);
        return tomorrow;
    });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>("09:00");

    useEffect(() => {
        const slots = [];
        for (let hour = 9; hour <= 17; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, "0")}:${minute
                    .toString()
                    .padStart(2, "0")}`;
                slots.push(time);
            }
        }
        setTimeSlots(slots);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!date) {
            toast.error("Please select a date");
            setIsSubmitting(false);
            return;
        }

        const [hours, minutes] = selectedTime.split(":").map(Number);
        const appointmentDate = new Date(date);
        appointmentDate.setHours(hours, minutes, 0, 0);

        try {
            const appointmentPromise = new Promise(async (resolve, reject) => {
                try {
                    const res = await fetch("/api/appointments", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...formData,
                            scheduled_at: appointmentDate.toISOString(),
                        }),
                    });

                    if (!res.ok) {
                        const data = await res.json();
                        reject(
                            new Error(
                                data.error || "Failed to book appointment"
                            )
                        );
                        return;
                    }

                    resolve("Appointment booked successfully!");
                } catch (err) {
                    reject(err);
                }
            });

            toast.promise(appointmentPromise, {
                loading: "Booking appointment...",
                success: (message) => {
                    setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        message: "",
                    });
                    setDate(() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        tomorrow.setHours(12, 0, 0, 0);
                        return tomorrow;
                    });
                    setSelectedTime("09:00");
                    return message as string;
                },
                error: (err) =>
                    (err as Error).message || "Something went wrong!",
            });

            await appointmentPromise;
        } catch (error) {
            console.error("Error booking appointment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone: string) => {
        return /^\+?[0-9\s\-]+$/.test(phone);
    };

    return (
        <div className="pb-20">
            <div className="mx-auto px-4">
                <div className="flex justify-start p-4">
                    <Link href="/" className="group">
                        <Button
                            variant="ghost"
                            className="px-4 py-2 rounded-lg transition-all group-hover:bg-primary/10"
                            aria-label="Go back to home page"
                        >
                            <ArrowLeftCircle className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors" />
                            <span className="ml-2 text-sm font-medium hidden sm:inline">
                                Back to Home
                            </span>
                        </Button>
                    </Link>
                </div>

                <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col items-center mb-8">
                        <Image
                            src={fhLogo}
                            alt="Company Logo"
                            className="h-24 w-auto"
                            priority
                        />
                        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-100 my-2">
                            Book an Appointment
                        </h1>
                        <p className="text-gray-600 text-center max-w-md">
                            Fill out the form below to schedule your appointment
                            with us.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 max-w-[600px] mx-auto"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    minLength={2}
                                    className="focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={`focus:ring-2 focus:ring-primary/50 ${
                                        formData.email &&
                                        !validateEmail(formData.email)
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {formData.email &&
                                    !validateEmail(formData.email) && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Please enter a valid email
                                        </p>
                                    )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+60123456789"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    className={`focus:ring-2 focus:ring-primary/50 ${
                                        formData.phone &&
                                        !validatePhone(formData.phone)
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {formData.phone &&
                                    !validatePhone(formData.phone) && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Please enter a valid phone number
                                        </p>
                                    )}
                            </div>

                            <div className="space-y-2">
                                <Label>Appointment Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal hover:bg-gray-50",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? (
                                                format(date, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            disabled={(dateToCheck) =>
                                                dateToCheck <
                                                new Date(
                                                    new Date().setHours(
                                                        24,
                                                        0,
                                                        0,
                                                        0
                                                    )
                                                )
                                            }
                                            fromYear={new Date().getFullYear()}
                                            toYear={
                                                new Date().getFullYear() + 1
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {date && (
                                <div className="space-y-2 col-span-full">
                                    <Label>Select Time *</Label>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                        {timeSlots.map((time) => (
                                            <Button
                                                key={time}
                                                type="button"
                                                variant={
                                                    selectedTime === time
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={() =>
                                                    setSelectedTime(time)
                                                }
                                                className="py-2 text-sm"
                                            >
                                                {time}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">
                                Additional Information
                            </Label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Any symptoms, special requests, or questions you might have..."
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                className="focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-6 text-lg font-medium shadow-sm hover:shadow-md transition-shadow"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Book Appointment"
                            )}
                        </Button>

                        <p className="text-xs text-gray-500 text-center">
                            By booking an appointment, you agree to our terms of
                            service and privacy policy.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
