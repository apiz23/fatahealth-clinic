"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserIcon } from "lucide-react";
import AppointmentDetails from "./appointment-details";
import { Appointment } from "@/interface";

interface AppointmentCardProps {
    appointment: Appointment;
    index: number;
}

export default function AppointmentCard({
    appointment,
    index,
}: AppointmentCardProps) {
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between shadow-cyan-200">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                    </Badge>
                    <Badge
                        variant={
                            appointment.status === "confirmed"
                                ? "default"
                                : appointment.status === "pending"
                                ? "destructive"
                                : appointment.status === "cancelled" ||
                                  appointment.status === null
                                ? "secondary"
                                : "secondary"
                        }
                        className="text-xs capitalize"
                    >
                        {appointment.status ?? "Not specified"}{" "}
                    </Badge>
                </div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold line-clamp-1">
                        {appointment.name}
                    </h2>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                    {appointment.email}
                </p>
            </div>

            <div className="mt-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                            View Details
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-lg flex flex-col">
                        <AppointmentDetails
                            appointment={appointment}
                            index={index}
                        />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
