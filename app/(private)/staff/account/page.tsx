"use client";
import React, { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone, User, Briefcase, Loader2 } from "lucide-react";

interface StaffProfile {
    id: string;
    user_id: string;
    position?: string;
    shift?: string;
    full_name?: string;
    phone?: string;
    email?: string;
    address?: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<StaffProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = JSON.parse(sessionStorage.getItem("user") || "{}");
                if (!user.id) {
                    console.error("User ID not found.");
                    return;
                }

                const { data, error } = await supabase
                    .from("fh_staffs")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (error) throw error;
                setProfile(data as StaffProfile);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card className="w-full max-w-md text-center p-8">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Profile Not Found
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            Unable to load profile. Please try again later.
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
                                {profile.full_name?.charAt(0).toUpperCase() ||
                                    "U"}
                            </span>
                        </div>
                        <Badge className="absolute -bottom-2 -right-2 bg-blue-600 text-white px-3 py-1">
                            Staff
                        </Badge>
                    </div>
                    <h1 className="text-2xl font-bold text-center">
                        {profile.full_name || "No Name"}
                    </h1>
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
                                <span>{profile.email || "Not provided"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-gray-500" />
                                <span>{profile.phone || "Not provided"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-gray-500" />
                                <span>{profile.address || "Not provided"}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Staff Information */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Staff Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm text-gray-500 mb-1">
                                    Position
                                </h3>
                                <p className="font-medium">
                                    {profile.position || "Not provided"}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm text-gray-500 mb-1">
                                    Shift
                                </h3>
                                <p className="font-medium">
                                    {profile.shift || "Not provided"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
