"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import AppointmentCard from "@/components/appointments/appointment-card";
import { Appointment } from "@/interface";

export default function DashboardPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const { data, error } = await supabase
            .from("fh_visits")
            .select("*")
            .order("scheduled_at", { ascending: true });

        if (error) {
            console.error("Error fetching appointments:", error);
        } else {
            const sanitizedData = (data || []).map((item) => ({
                ...item,
                status: ["confirmed", "pending", "cancelled"].includes(
                    item.status
                )
                    ? item.status
                    : null,
            }));
            setAppointments(sanitizedData as Appointment[]);
        }
    };

    // Filter today's appointments
    const todayAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.scheduled_at);
        const today = new Date();
        return (
            appointmentDate.getDate() === today.getDate() &&
            appointmentDate.getMonth() === today.getMonth() &&
            appointmentDate.getFullYear() === today.getFullYear()
        );
    });

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-gray-700 font-bold">Patients</h2>
                    <p className="text-2xl text-blue-700 mt-2">120</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-gray-700 font-bold">
                        Appointments Today
                    </h2>
                    <p className="text-2xl text-blue-700 mt-2">
                        {todayAppointments.length}
                    </p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-gray-700 font-bold">Prescriptions</h2>
                    <p className="text-2xl text-blue-700 mt-2">75</p>
                </div>
            </div>

            {/* Today's Appointments */}
            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Today{"'"}s Appointments
                </h2>
                {todayAppointments.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {todayAppointments.map((appointment, index) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No appointments scheduled for today.
                    </div>
                )}
            </div>

            {/* All Appointments */}
            <div>
                <h2 className="text-xl font-semibold mb-4 mt-8">
                    All Appointments
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {appointments.map((appointment, index) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
