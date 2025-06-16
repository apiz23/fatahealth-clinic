"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import AppointmentCard from "@/components/appointments/appointment-card";
import { Calendar, Hospital, TrendingUp } from "lucide-react";
import { Appointment } from "@/interface";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function DashboardPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctorId, setDoctorId] = useState<string | null>(null);
    const [patientsCountPerMonth, setPatientsCountPerMonth] = useState<
        { month: string; count: number }[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (typeof window === "undefined") return;

            const userJson = sessionStorage.getItem("user");
            if (!userJson) {
                setDoctorId(null);
                setLoading(false);
                return;
            }

            try {
                const user = JSON.parse(userJson);
                setDoctorId(user?.id ?? null);

                const [appointmentsRes] = await Promise.all([
                    supabase
                        .from("fh_appointments")
                        .select("*")
                        .eq("doctor_id", user.id)
                        .order("scheduled_at", { ascending: true }),
                    supabase
                        .from("fh_patients")
                        .select("*", { count: "exact", head: true }),
                    fetchPatientsCountByMonth(),
                ]);

                setAppointments(appointmentsRes.data ?? []);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchPatientsCountByMonth = async () => {
        const { data, error } = await supabase
            .from("fh_patients")
            .select("id, created_at");

        if (error) {
            console.error("Error fetching patients:", error);
            return [];
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

    const assignedAppointments = appointments.filter(
        (appointment) => appointment.doctor_id === doctorId
    );

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

    const upcomingAppointments = assignedAppointments
        .filter((appointment) => {
            const appointmentDate = new Date(appointment.scheduled_at);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return appointmentDate >= today;
        })
        .sort(
            (a, b) =>
                new Date(a.scheduled_at).getTime() -
                new Date(b.scheduled_at).getTime()
        );

    const totalPatients = patientsCountPerMonth.reduce(
        (sum, item) => sum + item.count,
        0
    );

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 min-h-[100px] border transition-colors  bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-900/50 border-gray-200 dark:border-neutral-700">
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                                Total Patients
                            </p>
                            {loading ? (
                                <Skeleton className="h-8 w-20" />
                            ) : (
                                <p className="text-3xl font-bold">
                                    {totalPatients.toLocaleString()}
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
                                Today{"'"}s Appointments
                            </p>
                            {loading ? (
                                <Skeleton className="h-8 w-20" />
                            ) : (
                                <p className="text-3xl font-bold">
                                    {todayAssignedAppointments.length}
                                </p>
                            )}
                        </div>
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30">
                            <Calendar className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-fit rounded-lg border"
            >
                {/* Appointments Panel */}
                <ResizablePanel defaultSize={40}>
                    <div className="h-full space-y-4 p-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Today{"'"}s Schedule</CardTitle>
                                <CardDescription>
                                    {todayAssignedAppointments.length}{" "}
                                    appointments today
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {loading ? (
                                    Array.from({ length: 2 }).map((_, i) => (
                                        <Skeleton
                                            key={i}
                                            className="h-20 w-full rounded-lg"
                                        />
                                    ))
                                ) : todayAssignedAppointments.length > 0 ? (
                                    todayAssignedAppointments.map(
                                        (appointment, index) => (
                                            <AppointmentCard
                                                key={appointment.id}
                                                appointment={appointment}
                                                index={index}
                                            />
                                        )
                                    )
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground">
                                        No appointments today
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Appointments</CardTitle>
                                <CardDescription>
                                    Next {upcomingAppointments.length}{" "}
                                    appointments
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton
                                            key={i}
                                            className="h-20 w-full rounded-lg"
                                        />
                                    ))
                                ) : upcomingAppointments.length > 0 ? (
                                    upcomingAppointments
                                        .slice(0, 3)
                                        .map((appointment, index) => (
                                            <AppointmentCard
                                                key={appointment.id}
                                                appointment={appointment}
                                                index={index}
                                            />
                                        ))
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground">
                                        No upcoming appointments
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </ResizablePanel>

                <ResizableHandle />

                {/* Chart Panel */}
                <ResizablePanel defaultSize={60}>
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>Patient Registrations</CardTitle>
                            <CardDescription>
                                Monthly patient registration trends
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-120px)]">
                            {loading ? (
                                <Skeleton className="h-full w-full" />
                            ) : (
                                <div className="w-full h-full">
                                    <ChartContainer
                                        config={{
                                            count: {
                                                label: "Patients",
                                                color: "var(--chart-1)",
                                            },
                                        }}
                                    >
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart
                                                data={patientsCountPerMonth}
                                                margin={{
                                                    top: 20,
                                                    right: 10,
                                                    left: 10,
                                                    bottom: 20,
                                                }}
                                            >
                                                <XAxis
                                                    dataKey="month"
                                                    tickLine={false}
                                                    tickMargin={10}
                                                    axisLine={false}
                                                    tickFormatter={(value) =>
                                                        value.slice(0, 3)
                                                    }
                                                />
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={
                                                        <ChartTooltipContent
                                                            hideLabel
                                                        />
                                                    }
                                                />
                                                <Bar
                                                    dataKey="count"
                                                    fill="#80DEEA"
                                                    radius={[4, 4, 0, 0]}
                                                    barSize={24}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </div>
                            )}
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
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
