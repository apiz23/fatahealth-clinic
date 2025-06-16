"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import AppointmentCard from "@/components/appointments/appointment-card";
import { Appointment } from "@/interface";
import { Calendar, Hospital, TrendingUp } from "lucide-react";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
    CardHeader,
    CardFooter,
} from "@/components/ui/card";
import { ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patientsCountPerMonth, setPatientsCountPerMonth] = useState<
        { month: string; count: number }[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchAppointments(),
                    fetchPatientsCountByMonth(),
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchAppointments = async () => {
        const { data, error } = await supabase
            .from("fh_appointments")
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

    const fetchPatientsCountByMonth = async () => {
        const { data, error } = await supabase
            .from("fh_patients")
            .select("id, created_at");

        if (error) {
            console.error("Error fetching patients:", error);
            return;
        }

        const now = new Date();
        const monthsToShow = [-1, 0, 1];
        const targetMonths = monthsToShow.map((offset) => {
            const date = new Date(
                now.getFullYear(),
                now.getMonth() + offset,
                1
            );
            return {
                label: date.toLocaleString("default", { month: "long" }),
                year: date.getFullYear(),
                month: date.getMonth(),
                count: 0,
            };
        });

        (data || []).forEach((patient) => {
            const createdAt = new Date(patient.created_at);
            targetMonths.forEach((target) => {
                if (
                    createdAt.getMonth() === target.month &&
                    createdAt.getFullYear() === target.year
                ) {
                    target.count++;
                }
            });
        });

        setPatientsCountPerMonth(
            targetMonths.map((m) => ({ month: m.label, count: m.count }))
        );
    };

    const todayAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.scheduled_at);
        const today = new Date();
        return (
            appointmentDate.getDate() === today.getDate() &&
            appointmentDate.getMonth() === today.getMonth() &&
            appointmentDate.getFullYear() === today.getFullYear()
        );
    });

    const totalPatients = patientsCountPerMonth.reduce(
        (sum, item) => sum + item.count,
        0
    );

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="p-6 min-h-[100px] border transition-colors  bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-900/50 border-gray-200 dark:border-neutral-700">
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                                Total Patients
                            </p>
                            {loading ? (
                                <Skeleton className="h-8 w-20" />
                            ) : (
                                <p className="text-3xl font-semibold">
                                    {totalPatients}
                                </p>
                            )}
                        </div>
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                            <Hospital className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="p-6 min-h-[100px] border transition-colors  bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-900/50 border-gray-200 dark:border-neutral-700">
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                                Appointments Today
                            </p>
                            {loading ? (
                                <Skeleton className="h-8 w-20" />
                            ) : (
                                <p className="text-3xl font-semibold">
                                    {todayAppointments.length}
                                </p>
                            )}
                        </div>
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30">
                            <Calendar className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Upcoming Appointments</CardTitle>
                        <CardDescription>
                            {appointments.length} total appointments
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className="h-24 w-full rounded-lg"
                                    />
                                ))
                            ) : appointments.length > 0 ? (
                                appointments.map((appointment, index) => (
                                    <AppointmentCard
                                        key={appointment.id}
                                        appointment={appointment}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No appointments found
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Patient Registrations</CardTitle>
                        <CardDescription>
                            {patientsCountPerMonth
                                .map((p) => p.month)
                                .join(" - ")}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <ChartContainer
                            config={{
                                count: {
                                    label: "Patients",
                                    color: "var(--chart-1)",
                                },
                            }}
                        >
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart
                                    data={patientsCountPerMonth}
                                    margin={{
                                        top: 5,
                                        right: 10,
                                        left: 0,
                                        bottom: 5,
                                    }}
                                >
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        tickMargin={6}
                                        axisLine={false}
                                        tickFormatter={(value) =>
                                            value.slice(0, 3)
                                        }
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent hideLabel />
                                        }
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="#80DEEA"
                                        radius={6}
                                        barSize={24}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="px-4 py-3 border-t">
                        <div className="flex flex-col w-full gap-2">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">
                                            Total Patients:
                                        </span>
                                        <span className="font-medium text-foreground">
                                            {totalPatients}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">
                                            Monthly Average:
                                        </span>
                                        <span className="font-medium text-foreground">
                                            {(
                                                totalPatients /
                                                patientsCountPerMonth.length
                                            ).toFixed(1)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md text-primary text-sm font-medium">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>More patients this month</span>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
