"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { toast } from "sonner";
import AppointmentCard from "@/components/appointments/appointment-card";
import { Input } from "@/components/ui/input";
import { Appointment } from "@/interface";

export default function StaffAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<
        Appointment[]
    >([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const { data, error } = await supabase
            .from("fh_visits")
            .select("*")
            .order("scheduled_at", { ascending: true });

        if (error) {
            console.error(error);
            toast.error("Failed to load appointments");
        } else {
            const formattedData = data || [];
            setAppointments(formattedData);
            setFilteredAppointments(formattedData);
        }
    };

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = appointments.filter((appointment) =>
            `${appointment.name} ${appointment.email} ${appointment.phone}`
                .toLowerCase()
                .includes(query)
        );
        setFilteredAppointments(filtered);
    }, [searchQuery, appointments]);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-start items-start md:items-center gap-4 mb-6">
                <div className="w-full md:w-auto">
                    <Input
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="md:w-[300px]"
                    />
                </div>
            </div>

            <div className="text-sm text-muted-foreground mb-4">
                {filteredAppointments.length} appointments
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
        </div>
    );
}
