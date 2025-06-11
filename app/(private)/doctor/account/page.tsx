"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    CalendarDays,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Stethoscope,
    User,
} from "lucide-react";
import { DoctorProfile } from "@/interface";

export default function ProfilePage() {
    const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        const userId = user.id;

        const fetchDoctorProfile = async () => {
            try {
                // Fetch doctor profile
                const { data: doctorData, error: doctorError } = await supabase
                    .from("fh_doctors")
                    .select("*")
                    .eq("user_id", userId)
                    .single();

                if (doctorError) throw doctorError;

                if (!doctorData) {
                    console.error("Doctor not found.");
                    return;
                }

                // Fetch doctor schedule
                const { data: scheduleData, error: scheduleError } =
                    await supabase
                        .from("fh_doctor_schedules")
                        .select("day_of_week") // Only select the `day_of_week` column
                        .eq("doctor_id", doctorData.id);

                if (scheduleError) {
                    console.error(
                        "Error fetching doctor schedule:",
                        scheduleError
                    );
                }

                // Combine profile and schedule data
                const doctorProfile = {
                    full_name: doctorData.full_name,
                    specialization: doctorData.specialization,
                    email: doctorData.email,
                    phone: doctorData.phone,
                    address: doctorData.address,
                    available_days:
                        scheduleData
                            ?.map((item) => item.day_of_week)
                            .join(", ") || "Not specified", // Join days into a comma-separated string
                    available_time: "Not specified", // No `available_time` column exists
                };

                setDoctorProfile(doctorProfile);
            } catch (error) {
                console.error(
                    "Error fetching doctor profile and schedule:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!doctorProfile) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Profile Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            Unable to load doctor profile. Please try again
                            later.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-3xl font-bold text-blue-600">
                                {doctorProfile.full_name
                                    ?.charAt(0)
                                    .toUpperCase() || "U"}
                            </span>
                        </div>
                        <Badge className="absolute -bottom-2 -right-2 bg-blue-600 text-white px-3 py-1">
                            Doctor
                        </Badge>
                    </div>
                    <h1 className="text-2xl font-bold text-center">
                        {doctorProfile.full_name || "No Name"}
                    </h1>
                    <p className="text-blue-600 mt-1">
                        {doctorProfile.specialization || "General Practitioner"}
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Contact Card */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Contact Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-500" />
                                <span>
                                    {doctorProfile.email || "Not provided"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-gray-500" />
                                <span>
                                    {doctorProfile.phone || "Not provided"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-gray-500" />
                                <span>
                                    {doctorProfile.address || "Not provided"}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Professional Info */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5" />
                                    Professional Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm text-gray-500 mb-1">
                                        Specialization
                                    </h3>
                                    <p className="font-medium">
                                        {doctorProfile.specialization ||
                                            "Not provided"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Availability Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CalendarDays className="h-5 w-5" />
                                    Availability
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm text-gray-500 mb-2">
                                        Available Days
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {doctorProfile.available_days ? (
                                            doctorProfile.available_days
                                                .split(",")
                                                .map((day: string) => (
                                                    <Badge
                                                        key={day.trim()}
                                                        variant="outline"
                                                    >
                                                        {day.trim()}
                                                    </Badge>
                                                ))
                                        ) : (
                                            <p className="text-gray-500">
                                                Not specified
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
