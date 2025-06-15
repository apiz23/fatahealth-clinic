"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { Prescription } from "@/interface";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface Medicine {
    id: string;
    name: string;
    quantity: number;
    price_at_prescription: number;
}

interface PrescriptionListProps {
    patientId: string;
    searchTerm: string;
}

export default function PrescriptionList({
    patientId,
    searchTerm,
}: PrescriptionListProps) {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPrescription, setSelectedPrescription] =
        useState<Prescription | null>(null);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loadingMedicines, setLoadingMedicines] = useState(false);
    const [medicinesError, setMedicinesError] = useState<string | null>(null);
    const [doctorName, setDoctorName] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("fh_prescriptions")
                .select("*")
                .eq("patient_id", patientId)
                .order("created_at", { ascending: false });

            if (error) {
                setError("Failed to fetch prescriptions");
                console.error(error);
            } else {
                setPrescriptions(data || []);
            }
            setLoading(false);
        };

        if (patientId) fetchPrescriptions();

        const fetchDoctorName = async () => {
            if (!selectedPrescription?.prescribed_by) {
                setDoctorName(null);
                return;
            }

            const { data, error } = await supabase
                .from("fh_doctors")
                .select("full_name")
                .eq("user_id", selectedPrescription.prescribed_by)
                .single();

            if (error) {
                console.error("Failed to fetch doctor name:", error);
                setDoctorName(null);
            } else {
                setDoctorName(data?.full_name || "Unknown doctor");
            }
        };

        fetchDoctorName();
    }, [patientId, selectedPrescription]);

    const fetchMedicinesForPrescription = async (prescriptionId: string) => {
        setLoadingMedicines(true);
        setMedicinesError(null);

        try {
            const { data: prescMeds, error: prescMedsError } = await supabase
                .from("fh_prescription_medicines")
                .select("medicine_id, quantity, price_at_prescription")
                .eq("prescription_id", prescriptionId);

            if (prescMedsError) throw prescMedsError;

            if (!prescMeds || prescMeds.length === 0) {
                setMedicines([]);
                return;
            }

            const medicineIds = prescMeds.map((pm) => pm.medicine_id);

            const { data: medicinesData, error: medicinesError } =
                await supabase
                    .from("fh_medicines")
                    .select("id, name")
                    .in("id", medicineIds);

            if (medicinesError) throw medicinesError;

            const meds = prescMeds.map((pm) => {
                const med = medicinesData?.find((m) => m.id === pm.medicine_id);
                return {
                    id: pm.medicine_id,
                    quantity: pm.quantity,
                    price_at_prescription: pm.price_at_prescription,
                    name: med?.name ?? "Unknown",
                };
            });

            setMedicines(meds);
        } catch (err) {
            setMedicinesError("Failed to fetch medicines");
            console.error(err);
        } finally {
            setLoadingMedicines(false);
        }
    };

    const openDialog = (prescription: Prescription) => {
        setSelectedPrescription(prescription);
        fetchMedicinesForPrescription(prescription.id);
        setDialogOpen(true);
    };

    const filtered = prescriptions.filter((p) =>
        `${p.diagnosis ?? ""} ${p.notes ?? ""}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>Loading prescriptions...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-4">
            {filtered.length === 0 ? (
                <p>No prescriptions found for this patient.</p>
            ) : (
                <div className="gap-6">
                    {filtered.map((p, index) => (
                        <div
                            key={p.id}
                            className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-900/50 border-gray-200 dark:border-neutral-700"
                        >
                            <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                                {index + 1}. {p.diagnosis || "No diagnosis"}
                            </h3>
                            <div className="dark:text-gray-200">
                                <p className="text-sm mb-1">
                                    <b>Notes:</b> {p.notes || "N/A"}
                                </p>
                                <p className="text-sm mb-1">
                                    <b>Date:</b>{" "}
                                    {p.created_at
                                        ? new Date(
                                              p.created_at
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </p>
                                <p className="text-sm">
                                    <b>Status:</b> {p.status || "Active"}
                                </p>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => openDialog(p)}
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-foreground">
                            Prescription Details
                        </DialogTitle>
                        {selectedPrescription ? (
                            <div className="space-y-4 pt-2">
                                {/* Diagnosis Section */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                        Diagnosis
                                    </h4>
                                    <div className="rounded-md bg-muted p-3">
                                        <p className="text-foreground">
                                            {selectedPrescription.diagnosis ||
                                                "No diagnosis recorded"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                        Prescribed By
                                    </h4>
                                    <div className="rounded-md bg-muted p-3">
                                        <p className="text-foreground whitespace-pre-line">
                                            Dr{" "}
                                            {doctorName ||
                                                "No doctor prescribed"}
                                        </p>
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                        Doctor{"'"}s Notes
                                    </h4>
                                    <div className="rounded-md bg-muted p-3">
                                        <p className="text-foreground whitespace-pre-line">
                                            {selectedPrescription.notes ||
                                                "No additional notes"}
                                        </p>
                                    </div>
                                </div>

                                {/* Medicines Section */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                        Prescribed Medicines
                                    </h4>
                                    {loadingMedicines ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Loading medicines...
                                            </span>
                                        </div>
                                    ) : medicinesError ? (
                                        <div className="rounded-md bg-destructive/10 p-3">
                                            <p className="text-destructive">
                                                {medicinesError}
                                            </p>
                                        </div>
                                    ) : medicines.length === 0 ? (
                                        <div className="rounded-md bg-muted p-3">
                                            <p className="text-muted-foreground">
                                                No medicines prescribed
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-hidden rounded-md border">
                                            <table className="min-w-full divide-y divide-border">
                                                <thead className="bg-muted">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                                        >
                                                            Medicine
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                                        >
                                                            Quantity
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                                        >
                                                            Price (RM) / Pack
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border bg-background">
                                                    {medicines.map((med) => (
                                                        <tr key={med.id}>
                                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-foreground">
                                                                {med.name}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                                                                {med.quantity}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                                                                {med.price_at_prescription?.toFixed(
                                                                    2
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="mr-2 h-5 w-5 animate-spin text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    Loading prescription details...
                                </span>
                            </div>
                        )}
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
