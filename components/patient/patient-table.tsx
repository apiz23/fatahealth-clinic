"use client";

import { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";
import supabase from "@/lib/supabase";
import { Bill, Patient } from "@/interface";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    HeartIcon,
    PhoneIcon,
    UserIcon,
    HomeIcon,
    LetterText,
    TriangleAlert,
} from "lucide-react";

export default function PatientCardList({ patients }: { patients: Patient[] }) {
    const [bills, setBills] = useState<Bill[]>([]);

    useEffect(() => {
        const fetchBills = async () => {
            const { data, error } = await supabase.from("fh_bills").select("*");
            if (error) {
                toast.error("Failed to fetch bills");
                console.error(error);
            } else {
                setBills(data || []);
            }
        };

        fetchBills();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.length > 0 ? (
                patients.map((patient) => (
                    <Card
                        key={patient.id}
                        className="hover:shadow-md transition-shadow dark:shadow-cyan-200 "
                    >
                        <CardHeader className="flex flex-row items-start gap-4 pb-3">
                            <Avatar className="h-12 w-12">
                                <AvatarImage alt={patient.name} />
                                <AvatarFallback className="bg-blue-100 text-blue-800">
                                    {patient.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <CardTitle className="text-lg">
                                    {patient.name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <span>IC: {patient.ic}</span>
                                    <Badge
                                        variant={
                                            patient.status?.toLowerCase() ===
                                            "active"
                                                ? "default"
                                                : "destructive"
                                        }
                                        className="text-xs h-5"
                                    >
                                        {patient.status || "Active"}
                                    </Badge>
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <HeartIcon className="h-4 w-4 text-red-500" />
                                <span>
                                    Blood Type:{" "}
                                    <Badge variant="outline" className="ml-1">
                                        {patient.blood_type || "Unknown"}
                                    </Badge>
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <PhoneIcon className="h-4 w-4 text-blue-500" />
                                <span>
                                    {patient.phone || "No phone provided"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <LetterText className="h-4 w-4 text-gray-500" />
                                <span className="truncate">
                                    {patient.email || "No email provided"}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-0">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        View Details
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="right"
                                    className="w-full sm:max-w-xl overflow-y-auto"
                                >
                                    <SheetHeader className="border-b pb-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage
                                                    alt={patient.name}
                                                />
                                                <AvatarFallback className="bg-blue-100 text-blue-800">
                                                    {patient.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <SheetTitle>
                                                    {patient.name}
                                                </SheetTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    IC: {patient.ic}
                                                </p>
                                            </div>
                                        </div>
                                    </SheetHeader>
                                    <div className="grid gap-6 p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h3 className="font-medium flex items-center gap-2">
                                                    <UserIcon className="h-5 w-5 text-blue-600" />
                                                    Personal Information
                                                </h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Gender
                                                        </p>
                                                        <p className="font-medium">
                                                            {patient.gender ||
                                                                "Not specified"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Blood Type
                                                        </p>
                                                        <Badge
                                                            variant="outline"
                                                            className="mt-1"
                                                        >
                                                            {patient.blood_type ||
                                                                "Unknown"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="font-medium flex items-center gap-2">
                                                    <PhoneIcon className="h-5 w-5 text-blue-600" />
                                                    Contact Information
                                                </h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Phone
                                                        </p>
                                                        <p className="font-medium">
                                                            {patient.phone ||
                                                                "Not provided"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Alt. Phone
                                                        </p>
                                                        <p className="font-medium">
                                                            {patient.phone_number ||
                                                                "Not provided"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Email
                                                        </p>
                                                        <p className="font-medium">
                                                            {patient.email ||
                                                                "Not provided"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 md:col-span-2">
                                                <h3 className="font-medium flex items-center gap-2">
                                                    <HomeIcon className="h-5 w-5 text-blue-600" />
                                                    Address
                                                </h3>
                                                <p className="text-sm">
                                                    {patient.address ||
                                                        "Not provided"}
                                                </p>
                                            </div>

                                            <div className="space-y-4 md:col-span-2">
                                                <h3 className="font-medium flex items-center gap-2">
                                                    <TriangleAlert className="h-5 w-5 text-blue-600" />
                                                    Emergency Contact
                                                </h3>
                                                <p className="text-sm">
                                                    {patient.emergency_contact ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                            <div className="space-y-4 md:col-span-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-blue-50">
                                                        <LetterText className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <h3 className="font-medium text-base">
                                                        Billing History
                                                    </h3>
                                                </div>

                                                {bills.filter(
                                                    (b) =>
                                                        b.patient_id ===
                                                        patient.id
                                                ).length > 0 ? (
                                                    <div className="space-y-3">
                                                        {bills
                                                            .filter(
                                                                (bill) =>
                                                                    bill.patient_id ===
                                                                    patient.id
                                                            )
                                                            .map(
                                                                (
                                                                    bill,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <div>
                                                                                <p className="text-sm text-gray-500">
                                                                                    {new Date(
                                                                                        bill.created_at
                                                                                    ).toLocaleDateString(
                                                                                        "en-US",
                                                                                        {
                                                                                            year: "numeric",
                                                                                            month: "short",
                                                                                            day: "numeric",
                                                                                        }
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                            <Badge
                                                                                variant={
                                                                                    bill.payment_status ===
                                                                                    "paid"
                                                                                        ? "default"
                                                                                        : "destructive"
                                                                                }
                                                                                className="text-xs"
                                                                            >
                                                                                {bill.payment_status.toUpperCase()}
                                                                            </Badge>
                                                                        </div>

                                                                        <div className="flex items-center gap-6 mt-4">
                                                                            <div className="flex items-center gap-2">
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    Total
                                                                                    Amount:
                                                                                </p>
                                                                                <p className="font-medium text-lg">
                                                                                    RM{" "}
                                                                                    {Number(
                                                                                        bill.total_amount
                                                                                    ).toFixed(
                                                                                        2
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                    </div>
                                                ) : (
                                                    <div className="rounded-lg border border-dashed p-4 text-center">
                                                        <p className="text-sm text-gray-500">
                                                            No billing records
                                                            found
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <div className="col-span-full py-12 text-center">
                    <div className="mx-auto max-w-md">
                        <h3 className="text-lg font-medium">
                            No patients found
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            There are currently no patients in the system.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
