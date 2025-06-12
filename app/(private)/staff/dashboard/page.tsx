"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import AppointmentCard from "@/components/appointments/appointment-card";
import { Appointment } from "@/interface";
import { Calendar, Hospital } from "lucide-react";

export default function DashboardPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patientsCount, setPatientsCount] = useState<number>(0);

    useEffect(() => {
        fetchAppointments();
        fetchPatientsCount();
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

    const fetchPatientsCount = async () => {
        const { count, error } = await supabase
            .from("fh_patients")
            .select("*", { count: "exact", head: true });

        if (error) {
            console.error(error);
            return;
        }
        setPatientsCount(count ?? 0);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Patients Card */}
                <div className="flex items-center justify-between rounded-lg p-6 min-h-[100px] bg-white dark:bg-gray-800 shadow dark:shadow-cyan-200/20 border dark:border-gray-700">
                    <div>
                        <h2 className="text-gray-600 dark:text-gray-300 text-sm font-medium uppercase mb-1">
                            Patients
                        </h2>
                        <p className="text-3xl font-semibold text-blue-700 dark:text-cyan-400">
                            {patientsCount}
                        </p>
                    </div>
                    <Hospital className="h-10 w-10 text-blue-700 dark:text-cyan-400" />
                </div>

                {/* Today's Appointments Card */}
                <div className="flex items-center justify-between rounded-lg p-6 min-h-[100px] bg-white dark:bg-gray-800 shadow dark:shadow-cyan-200/20 border dark:border-gray-700">
                    <div>
                        <h2 className="text-gray-600 dark:text-gray-300 text-sm font-medium uppercase mb-1">
                            Appointments Today
                        </h2>
                        <p className="text-3xl font-semibold text-blue-700 dark:text-cyan-400">
                            {todayAppointments.length}
                        </p>
                    </div>
                    <Calendar className="h-10 w-10 text-blue-700 dark:text-cyan-400" />
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
