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
import { Input } from "@/components/ui/input";

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filter, setFilter] = useState<"all" | "assigned" | "unassigned">(
        "all"
    );
    const [error, setError] = useState<string | null>(null);
    const [doctorId, setDoctorId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

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
        let filtered = appointments;

        if (doctorId) {
            if (filter === "assigned") {
                filtered = filtered.filter((a) => a.doctor_id === doctorId);
            } else if (filter === "unassigned") {
                filtered = filtered.filter((a) => a.doctor_id == null);
            }
        }
        if (searchTerm.trim() !== "") {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (a) =>
                    a.name.toLowerCase().includes(lower) ||
                    a.email.toLowerCase().includes(lower) ||
                    a.phone.toLowerCase().includes(lower) ||
                    a.type?.toLowerCase().includes(lower) ||
                    a.message.toLowerCase().includes(lower)
            );
        }

        return filtered;
    }, [appointments, filter, doctorId, searchTerm]);

    if (error) return <div>{error}</div>;

    return (
        <>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div className="text-sm text-muted-foreground">
                    <Input
                        type="text"
                        placeholder="Search by patient, doctor or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-[400px] px-4 py-2 border rounded-md bg-white dark:bg-neutral-900 text-sm text-foreground placeholder:text-muted-foreground"
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <Select
                        value={filter}
                        onValueChange={(value) =>
                            setFilter(
                                value as "all" | "assigned" | "unassigned"
                            )
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter appointments" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="unassigned">
                                Unassigned
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
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
