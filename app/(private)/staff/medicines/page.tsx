"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import supabase from "@/lib/supabase";
import { Loader2, PackageIcon } from "lucide-react";
import { MedicineCard } from "@/components/medications/medications-card";
import { Medicine } from "@/interface";
import { AddMedicineSheet } from "@/components/medications/medication-add";

export default function SupplierPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("fh_medicines")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            toast.error("Failed to load medicines");
            console.error(error);
        } else {
            setMedicines(data || []);
        }
        setLoading(false);
    };

    const handleMedicineAdded = (newMedicine: Medicine) => {
        setMedicines([...medicines, newMedicine]);
    };

    const filteredMedicines = medicines.filter(
        (medicine) =>
            medicine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.supplier
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            medicine.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between items-center sm:flex-row gap-4">
                <Input
                    placeholder="Search medicines by name, supplier or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:w-[500px] max-w-sm transition-all duration-200
                    bg-background text-foreground
                    border border-input hover:border-primary/50
                    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                    dark:bg-background dark:text-foreground
                    dark:border-input dark:hover:border-primary/70
                    dark:focus-visible:ring-primary/80 dark:focus-visible:ring-offset-background"
                />
                <AddMedicineSheet onMedicineAdded={handleMedicineAdded} />
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : filteredMedicines.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredMedicines.map((medicine) => (
                        <MedicineCard key={medicine.id} medicine={medicine} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 space-y-2">
                    <PackageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="text-lg font-medium">No medicines found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search or filter to find what you
                        {"'"}re looking for.
                    </p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setSearchTerm("")}
                    >
                        Clear search
                    </Button>
                </div>
            )}
        </div>
    );
}
