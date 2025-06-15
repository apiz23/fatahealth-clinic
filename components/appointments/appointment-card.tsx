"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserIcon } from "lucide-react";
import AppointmentDetails from "./appointment-details";
import { Appointment } from "@/interface";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase"; // ✅ Make sure supabase is imported

interface AppointmentCardProps {
    appointment: Appointment;
    index: number;
}

export default function AppointmentCard({
    appointment,
    index,
}: AppointmentCardProps) {
    const [open, setOpen] = useState(false); // ✅ Sheet open state
    const [currentAppointment, setCurrentAppointment] =
        useState<Appointment>(appointment); // ✅ Fresh data

    useEffect(() => {
        if (!open) return;

        const fetchAppointment = async () => {
            const { data, error } = await supabase
                .from("fh_appointments")
                .select("*")
                .eq("id", appointment.id)
                .single();

            if (!error && data) {
                setCurrentAppointment(data);
            }
        };

        fetchAppointment();
    }, [open, appointment.id]); // ✅ Refetch when Sheet is opened

    return (
        <div className="rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between bg-gradient-to-b from-neutral-50 dark:from-neutral-900 to-neutral-100 dark:to-neutral-900/5 border-2 dark:border-neutral-700">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                    </Badge>
                    <Badge
                        variant={
                            currentAppointment.status === "done"
                                ? "default"
                                : currentAppointment.status === "cancelled" ||
                                  currentAppointment.status === null
                                ? "secondary"
                                : "secondary"
                        }
                        className="text-xs capitalize"
                    >
                        {currentAppointment.status ?? "Not specified"}
                    </Badge>
                </div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold line-clamp-1">
                        {currentAppointment.name}
                    </h2>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                    {currentAppointment.email}
                </p>
            </div>

            <div className="mt-4">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                            View Details
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-lg flex flex-col">
                        <AppointmentDetails
                            appointment={currentAppointment}
                            index={index}
                        />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
