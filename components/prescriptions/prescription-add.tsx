"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import supabase from "@/lib/supabase";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AddPrescriptionSheetProps {
    patientId: string;
}

export default function AddPrescriptionSheet({
    patientId,
}: AddPrescriptionSheetProps) {
    const [diagnosis, setDiagnosis] = useState("");
    const [notes, setNotes] = useState("");
    const [medicines, setMedicines] = useState<{ id: string; name: string }[]>(
        []
    );
    const [selectedMedicines, setSelectedMedicines] = useState<
        { id: string; qty: number }[]
    >([]);
    const [medicinePopoverOpen, setMedicinePopoverOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dialogOpen, setSheetOpen] = useState(false);

    useEffect(() => {
        const fetchMedicines = async () => {
            const { data, error } = await supabase
                .from("fh_medicines")
                .select("id, name");
            if (error) {
                console.error("Error fetching medicines:", error);
            } else {
                setMedicines(data || []);
            }
        };
        fetchMedicines();
    }, []);

    const toggleMedicine = (id: string) => {
        setSelectedMedicines((prev) => {
            const found = prev.find((m) => m.id === id);
            return found
                ? prev.filter((m) => m.id !== id)
                : [...prev, { id, qty: 1 }];
        });
    };

    const changeQty = (id: string, qty: number) => {
        if (qty < 1) return;
        setSelectedMedicines((prev) =>
            prev.map((m) => (m.id === id ? { ...m, qty } : m))
        );
    };

    const handleSubmit = () => {
        if (!patientId) return;
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        const doctorId = user.id as string | undefined;

        toast.promise(
            (async () => {
                const medIds = selectedMedicines.map((m) => m.id);
                const { data: medRows, error: medErr } = await supabase
                    .from("fh_medicines")
                    .select("id, price")
                    .in("id", medIds);

                if (medErr) throw medErr;

                const billingAmount = selectedMedicines.reduce((tot, item) => {
                    const unit =
                        medRows?.find((m) => m.id === item.id)?.price ?? "0";
                    return tot + parseFloat(unit) * item.qty;
                }, 0);

                const { data: presc, error: prescErr } = await supabase
                    .from("fh_prescriptions")
                    .insert([
                        {
                            patient_id: patientId,
                            diagnosis,
                            notes,
                            prescribed_by: doctorId ?? null,
                        },
                    ])
                    .select()
                    .single();

                if (prescErr) throw prescErr;

                const prescriptionId = presc.id;

                const prescMedRows = selectedMedicines.map((item) => {
                    const unitPrice =
                        medRows?.find((m) => m.id === item.id)?.price ?? "0";
                    return {
                        prescription_id: prescriptionId,
                        medicine_id: item.id,
                        quantity: item.qty,
                        price_at_prescription: unitPrice,
                    };
                });

                const { error: junctionErr } = await supabase
                    .from("fh_prescription_medicines")
                    .insert(prescMedRows);

                if (junctionErr) throw junctionErr;

                const { error: billErr } = await supabase
                    .from("fh_bills")
                    .insert([
                        {
                            patient_id: patientId,
                            total_amount: billingAmount.toFixed(2),
                            payment_status: "unpaid",
                            created_by: doctorId ?? null,
                        },
                    ]);

                if (billErr) throw billErr;

                setDiagnosis("");
                setNotes("");
                setSelectedMedicines([]);
                setSheetOpen(false);
            })(),
            {
                loading: "Saving prescription & bill...",
                success: "Prescription and bill saved successfully!",
                error: "Failed to save prescription & bill",
            }
        );
    };

    return (
        <Sheet open={dialogOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
                <Button>Add Prescription</Button>
            </SheetTrigger>
            <SheetContent className="min-h-[500px]">
                <SheetHeader>
                    <SheetTitle>Add Prescription</SheetTitle>
                    <SheetDescription>
                        Fill out the form below to add a new prescription.
                    </SheetDescription>
                </SheetHeader>
                <div className="p-4">
                    <div>
                        <Label className="block mb-1 font-medium">
                            Diagnosis
                        </Label>
                        <Input
                            type="text"
                            value={diagnosis}
                            placeholder="Instructions..."
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setDiagnosis(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>
                    <div className="mt-4">
                        <Label className="block mb-1 font-medium">Notes</Label>
                        <textarea
                            value={notes}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => setNotes(e.target.value)}
                            placeholder="Additional instructions..."
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>
                    <div className="mt-4">
                        <Label className="block mb-1 font-medium">
                            Medicines
                        </Label>
                        <Popover
                            open={medicinePopoverOpen}
                            onOpenChange={setMedicinePopoverOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={medicinePopoverOpen}
                                    className="w-full justify-between"
                                >
                                    {selectedMedicines.length > 0
                                        ? selectedMedicines
                                              .map(
                                                  (item) =>
                                                      medicines.find(
                                                          (m) =>
                                                              m.id === item.id
                                                      )?.name
                                              )
                                              .join(", ")
                                        : "Select medicines..."}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                align="start"
                                className="min-w-[var(--radix-popover-trigger-width)] p-0"
                            >
                                <Command>
                                    <CommandInput
                                        placeholder="Search medicines..."
                                        value={searchTerm}
                                        onValueChange={setSearchTerm}
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            No medicines found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {medicines
                                                .filter((m) =>
                                                    m.name
                                                        .toLowerCase()
                                                        .includes(
                                                            searchTerm.toLowerCase()
                                                        )
                                                )
                                                .map((medicine) => (
                                                    <CommandItem
                                                        key={medicine.id}
                                                        value={medicine.id}
                                                        onSelect={() =>
                                                            toggleMedicine(
                                                                medicine.id
                                                            )
                                                        }
                                                    >
                                                        {medicine.name}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto",
                                                                selectedMedicines.some(
                                                                    (m) =>
                                                                        m.id ===
                                                                        medicine.id
                                                                )
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <div className="mt-2 space-y-1">
                            {selectedMedicines.length === 0 ? (
                                <span className="text-sm text-gray-600">
                                    None
                                </span>
                            ) : (
                                selectedMedicines.map((m) => {
                                    const medName =
                                        medicines.find((x) => x.id === m.id)
                                            ?.name ?? m.id;
                                    return (
                                        <div
                                            key={m.id}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <span className="flex-1">
                                                {medName}
                                            </span>
                                            <Input
                                                type="number"
                                                min={1}
                                                value={m.qty}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    changeQty(
                                                        m.id,
                                                        +e.target.value
                                                    )
                                                }
                                                className="w-16 rounded border px-1 py-0.5 text-right"
                                            />
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                    <SheetFooter className="grid grid-cols-1 md:grid-cols-2 space-x-2 mt-4 p-0">
                        <Button
                            variant="outline"
                            onClick={() => setSheetOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                !diagnosis &&
                                !notes &&
                                selectedMedicines.length === 0
                            }
                        >
                            Save
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}
