"use client";

import { useEffect, useMemo, useState } from "react";
import supabase from "@/lib/supabase";
import { toast } from "sonner";
import AppointmentCard from "@/components/appointments/appointment-card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Appointment } from "@/interface";

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filter, setFilter] = useState<"all" | "assigned" | "unassigned">(
        "all"
    );
    const [error, setError] = useState<string | null>(null);
    const [doctorId, setDoctorId] = useState<string | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            const { data, error } = await supabase
                .from("fh_appointments")
                .select("*")
                .order("scheduled_at", { ascending: true });

            if (error) {
                console.error("Error fetching appointments:", error);
                setError("Error loading appointments");
                toast.error("Failed to load appointments");
            } else {
                setAppointments(data as Appointment[]);
            }
        };

        fetchAppointments();
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userJson = sessionStorage.getItem("user");
            if (userJson) {
                try {
                    const user = JSON.parse(userJson);
                    setDoctorId(user?.id ?? null);
                } catch (err) {
                    console.error(
                        "Failed to parse user from sessionStorage:",
                        err
                    );
                    setDoctorId(null);
                }
            }
        }
    }, []);

    const filteredAppointments = useMemo(() => {
        if (!doctorId) return appointments;

        switch (filter) {
            case "assigned":
                return appointments.filter((a) => a.doctor_id === doctorId);
            case "unassigned":
                return appointments.filter((a) => a.doctor_id == null);
            default:
                return appointments;
        }
    }, [appointments, filter, doctorId]);

    if (error) return <div>{error}</div>;

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-muted-foreground">
                    {filteredAppointments.length} appointments
                </div>

                <Select
                    value={filter}
                    onValueChange={(value) =>
                        setFilter(value as "all" | "assigned" | "unassigned")
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter appointments" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredAppointments.map((appointment, index) => (
                    <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        index={index}
                    />
                ))}
            </div>
        </>
    );
}
