"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import AppointmentCard from "@/components/appointments/appointment-card";
import { Calendar, Hospital } from "lucide-react";
import { Appointment } from "@/interface";

export default function DashboardPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patientsCount, setPatientsCount] = useState<number>(0);
    const [doctorId, setDoctorId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const userJson = sessionStorage.getItem("user");
        if (!userJson) {
            setDoctorId(null);
            return;
        }

        try {
            const user = JSON.parse(userJson);
            setDoctorId(user?.id ?? null);

            const fetchAppointments = async () => {
                const { data, error } = await supabase
                    .from("fh_visits")
                    .select("*")
                    .eq("doctor_id", user.id)
                    .order("scheduled_at", { ascending: true });

                if (error) {
                    console.error("Error fetching appointments:", error);
                    return;
                }
                setAppointments(data ?? []);
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

            // run kedua-dua fetch serentak
            Promise.all([fetchAppointments(), fetchPatientsCount()]).catch(
                console.error
            );
        } catch (err) {
            console.error("Fail parse user JSON:", err);
            setDoctorId(null);
        }
    }, []);

    // Filter appointments assigned to the current doctor
    const assignedAppointments = appointments.filter(
        (appointment) => appointment.doctor_id === doctorId
    );

    // Filter appointments scheduled for today
    const todayAssignedAppointments = assignedAppointments.filter(
        (appointment) => {
            const appointmentDate = new Date(appointment.scheduled_at);
            const today = new Date();
            return (
                appointmentDate.getDate() === today.getDate() &&
                appointmentDate.getMonth() === today.getMonth() &&
                appointmentDate.getFullYear() === today.getFullYear()
            );
        }
    );

    return (
        <div className="space-y-6">
            {/* Patient Statistics Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Patients Card */}
                <div className="flex items-center justify-between bg-white shadow rounded-lg p-6 min-h-[100px]">
                    <div>
                        <h2 className="text-gray-600 text-sm font-medium uppercase mb-1">
                            Patients
                        </h2>
                        <p className="text-3xl font-semibold text-blue-700">
                            {patientsCount}
                        </p>
                    </div>
                    <Hospital className="h-10 w-10 text-blue-700" />
                </div>

                {/* Today's Appointments Card */}
                <div className="flex items-center justify-between bg-white shadow rounded-lg p-6 min-h-[100px]">
                    <div>
                        <h2 className="text-gray-600 text-sm font-medium uppercase mb-1">
                            Appointments Today
                        </h2>
                        <p className="text-3xl font-semibold text-blue-700">
                            {todayAssignedAppointments.length}
                        </p>
                    </div>
                    <Calendar className="h-10 w-10 text-blue-700" />
                </div>
            </div>

            {/* Today's Appointments List */}
            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Today{"'"}s Appointments
                </h2>
                {todayAssignedAppointments.length ? (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {todayAssignedAppointments.map((appointment, index) => (
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

            {/* All Assigned Appointments List */}
            <div>
                <h2 className="text-xl font-semibold mb-4 mt-8">
                    All Assigned Appointments
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
