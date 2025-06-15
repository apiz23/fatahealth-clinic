"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PillIcon } from "lucide-react";
import { MedicineDetails } from "./medication-details";
import { Medicine } from "@/interface";

interface MedicineCardProps {
    medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
    return (
        <div className=" rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-900/50 border-gray-200 dark:border-neutral-700">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                        {medicine.category}
                    </Badge>
                    <Badge
                        variant={
                            medicine.quantity > 0 ? "default" : "destructive"
                        }
                        className="text-xs"
                    >
                        {medicine.quantity > 0
                            ? `In Stock: ${medicine.quantity}`
                            : "Out of Stock"}
                    </Badge>
                </div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <PillIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold line-clamp-1">
                        {medicine.name}
                    </h2>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {medicine.description}
                </p>
                <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-600">
                        RM {medicine.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {medicine.supplier}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex gap-2">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                            View Details
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-lg">
                        <MedicineDetails medicine={medicine} />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
