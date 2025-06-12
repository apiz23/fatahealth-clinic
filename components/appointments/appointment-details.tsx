"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
    CalendarIcon,
    MailIcon,
    PhoneIcon,
    MessageSquareIcon,
} from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import supabase from "@/lib/supabase";
import { Appointment } from "@/interface";

interface AppointmentDetailsProps {
    appointment: Appointment;
    index: number;
}

export default function AppointmentDetails({
    appointment,
    index,
}: AppointmentDetailsProps) {
    const [remarks, setRemarks] = useState(appointment.remarks || "");
    const [status, setStatus] = useState<string>(
        appointment.status || "scheduled"
    );
    const [assignDoctorId, setAssignDoctorId] = useState<string | null>(
        appointment.doctor_id || null
    );

    const [doctors, setDoctors] = useState<{ id: string; full_name: string }[]>(
        []
    );

    useEffect(() => {
        const fetchDoctors = async () => {
            const { data, error } = await supabase
                .from("fh_doctors")
                .select("user_id, full_name");

            if (error) {
                toast.error("Failed to fetch user profiles.");
                return;
            }

            type DoctorRecord = {
                user_id: string;
                full_name: string;
            };

            const doctorsList = data.map((doctor: DoctorRecord) => ({
                id: doctor.user_id,
                full_name: doctor.full_name,
            }));

            setDoctors(doctorsList);
        };

        fetchDoctors();
    }, []);

    const handleSaveRemarks = async () => {
        if (!appointment.id) {
            toast.error("Appointment ID is missing.");
            return;
        }

        const toastId = toast.loading("Saving…");

        const { error } = await supabase
            .from("fh_appointments")
            .update({
                status,
                remarks,
                doctor_id: assignDoctorId,
            })
            .eq("id", appointment.id);

        if (error) {
            toast.error("Failed to update appointment", {
                id: toastId,
                description: error.message,
            });
            console.error(error);
        } else {
            toast.success("Appointment updated successfully", { id: toastId });
        }
    };
    return (
        <>
            <SheetHeader className="border-b pb-4">
                <SheetTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xl font-semibold text-primary">
                            {appointment.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                            {appointment.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    appointment.status === "confirmed"
                                        ? "default"
                                        : appointment.status === "pending"
                                        ? "destructive"
                                        : "secondary"
                                }
                                className="text-xs capitalize"
                            >
                                {appointment.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                #{index + 1}
                            </span>
                        </div>
                    </div>
                </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col flex-1 p-4 space-y-6 overflow-y-auto">
                {/* ── Contact Info ───────────────── */}
                <section className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                        Contact Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ContactRow
                            icon={MailIcon}
                            label="Email"
                            value={appointment.email}
                        />
                        <ContactRow
                            icon={PhoneIcon}
                            label="Phone"
                            value={appointment.phone}
                        />
                    </div>
                </section>

                {/* ── Appointment Details ─────────── */}
                <section className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                        Appointment Details
                    </h4>
                    <ContactRow
                        icon={CalendarIcon}
                        label="Scheduled At"
                        value={`${new Date(
                            appointment.scheduled_at
                        ).toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}  •  ${new Date(
                            appointment.scheduled_at
                        ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}`}
                    />
                </section>

                {/* ── Notes ───────────────────────── */}
                <section className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                        Notes
                    </h4>
                    <ContactRow
                        icon={MessageSquareIcon}
                        label="Message"
                        value={appointment.message || "No message provided"}
                        valueClasses="whitespace-pre-line bg-secondary/30 rounded-lg p-3"
                    />
                </section>

                <section className="space-y-6">
                    <div className="space-y-4">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="scheduled">
                                    Scheduled
                                </SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                                <SelectItem value="cancelled">
                                    Cancelled
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <Label>Assign Doctor</Label>
                        <Select
                            value={assignDoctorId || ""}
                            onValueChange={(val) =>
                                setAssignDoctorId(val || null)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map((doc) => (
                                    <SelectItem key={doc.id} value={doc.id}>
                                        {doc.full_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <Label>Remarks</Label>
                        <Textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Enter remarks here"
                        />
                    </div>
                </section>

                <Button
                    onClick={handleSaveRemarks}
                    className="w-full mt-auto"
                    disabled={!assignDoctorId}
                >
                    Save
                </Button>
            </div>
        </>
    );
}

/* ────────────────────────────────
 * Small helper component for rows
 * ──────────────────────────────── */
function ContactRow({
    icon: Icon,
    label,
    value,
    valueClasses = "",
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    valueClasses?: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-secondary mt-0.5">
                <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className={`font-medium ${valueClasses}`}>{value}</p>
            </div>
        </div>
    );
}
