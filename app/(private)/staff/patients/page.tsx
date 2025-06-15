"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";
import { toast } from "sonner";
import PatientTable from "@/components/patient/patient-table";
import PatientForm from "@/components/patient/patient-form";
import { Patient } from "@/interface";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ✅ Add Input

export default function Page() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            const { data, error } = await supabase
                .from("fh_patients")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching patients:", error);
                toast.error("Failed to load patient data");
            } else {
                setPatients(data || []);
            }
        };

        fetchPatients();
    }, []);

    const filteredPatients = patients.filter((patient) =>
        `${patient.name} ${patient.email} ${patient.phone}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <Input
                    type="text"
                    placeholder="Search by name, email, or phone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm transition-all duration-200
                    bg-background text-foreground
                    border border-input hover:border-primary/50
                    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                    dark:bg-background dark:text-foreground
                    dark:border-input dark:hover:border-primary/70
                    dark:focus-visible:ring-primary/80 dark:focus-visible:ring-offset-background"
                />
                <Button onClick={() => setIsSheetOpen(true)}>
                    Add New Patient
                </Button>
            </div>

            <PatientTable patients={filteredPatients} />

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="w-full sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>Add New Patient</SheetTitle>
                        <SheetDescription>
                            Fill in all related inputs to add a new patient.
                        </SheetDescription>
                    </SheetHeader>
                    <PatientForm
                        onSuccess={() => {
                            setIsSheetOpen(false);
                        }}
                    />
                </SheetContent>
            </Sheet>
        </>
    );
}
