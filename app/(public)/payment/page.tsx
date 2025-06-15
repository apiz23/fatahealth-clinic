"use client";
import { useState } from "react";
import supabase from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Patient, Bill } from "@/interface";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeftCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function PaymentPage() {
    const [ic, setIc] = useState("");
    const [patient, setPatient] = useState<Patient | null>(null);
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSearch = async () => {
        if (!ic.trim()) {
            toast.error("Please enter an IC number");
            return;
        }
        setLoading(true);
        setPatient(null);
        setBills([]);
        try {
            const { data: patientData, error: patientErr } = await supabase
                .from("fh_patients")
                .select("*")
                .eq("ic", ic.trim())
                .single();
            if (patientErr || !patientData) {
                throw new Error("Patient not found");
            }
            setPatient(patientData as Patient);
            const { data: billData, error: billErr } = await supabase
                .from("fh_bills")
                .select("*")
                .eq("patient_id", patientData.id)
                .order("created_at", { ascending: false });
            if (billErr) throw billErr;
            setBills((billData || []) as Bill[]);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "An error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBill || !paymentAmount) return;

        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        const paymentPromise = new Promise<string>(async (resolve, reject) => {
            try {
                const { error } = await supabase
                    .from("fh_bills")
                    .update({ payment_status: "paid" })
                    .eq("id", selectedBill.id);

                if (error) throw error;
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const { data: billData, error: billErr } = await supabase
                    .from("fh_bills")
                    .select("*")
                    .eq("patient_id", patient?.id)
                    .order("created_at", { ascending: false });

                if (billErr) throw billErr;
                setBills((billData || []) as Bill[]);

                setPaymentAmount("");
                setSelectedBill(null);

                resolve(
                    `Payment of RM ${amount.toFixed(2)} processed successfully`
                );
                setIsDialogOpen(false);
            } catch (error) {
                reject(error);
            }
        });

        toast.promise(paymentPromise, {
            loading: "Processing payment...",
            success: (msg: string) => msg,
            error: "Failed to process payment",
        });
    };

    return (
        <>
            <div className="flex justify-start p-4">
                <Link href="/" className="group">
                    <Button
                        variant="ghost"
                        className="px-2 sm:px-4 py-2 rounded-lg transition-all group-hover:bg-primary/10"
                        aria-label="Go back to home page"
                    >
                        <ArrowLeftCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary group-hover:text-primary/80 transition-colors" />
                        <span className="ml-2 text-sm font-medium hidden sm:inline">
                            Back to Home
                        </span>
                    </Button>
                </Link>
            </div>
            <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="space-y-2">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                        Patient Billing Portal
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Search for patient bills by IC number
                    </p>
                </div>
                <Card>
                    <CardContent className="pt-4 sm:pt-6">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSearch();
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label
                                    htmlFor="icNumber"
                                    className="text-sm sm:text-base"
                                >
                                    Identification Number (XXXXXX-XX-XXXX)
                                </Label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Input
                                        id="icNumber"
                                        placeholder="Enter patient IC number (e.g. 000000-00-0000)"
                                        value={ic}
                                        onChange={(e) => setIc(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full sm:w-auto"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Searching...
                                            </>
                                        ) : (
                                            "Search"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                {patient && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base sm:text-lg">
                                Patient Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1 sm:space-y-2">
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Full Name
                                </p>
                                <p className="text-sm sm:text-base font-medium">
                                    {patient.name ?? "-"}
                                </p>
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    IC Number
                                </p>
                                <p className="text-sm sm:text-base font-medium">
                                    {patient.ic ?? "-"}
                                </p>
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Email
                                </p>
                                <p className="text-sm sm:text-base font-medium">
                                    {patient.email ?? "-"}
                                </p>
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Phone
                                </p>
                                <p className="text-sm sm:text-base font-medium">
                                    {patient.phone_number ?? "-"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
                {patient && (
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base sm:text-lg">
                                    Billing History
                                </CardTitle>
                                <Badge
                                    variant="outline"
                                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
                                >
                                    {bills.length}{" "}
                                    {bills.length === 1 ? "Bill" : "Bills"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {bills.length === 0 ? (
                                <div className="py-6 sm:py-8 text-center text-sm sm:text-base text-muted-foreground">
                                    No bills found for this patient
                                </div>
                            ) : (
                                <div className="border rounded-lg overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Amount (RM)
                                                </th>
                                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                            {bills.map((bill) => (
                                                <tr
                                                    key={bill.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                >
                                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                                                        {new Date(
                                                            bill.created_at
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                                                        {bill.total_amount.toFixed(
                                                            2
                                                        )}
                                                    </td>
                                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                        <Badge
                                                            variant={
                                                                bill.payment_status ===
                                                                "paid"
                                                                    ? "default"
                                                                    : bill.payment_status ===
                                                                      "partial"
                                                                    ? "secondary"
                                                                    : "destructive"
                                                            }
                                                            className="capitalize text-xs"
                                                        >
                                                            {
                                                                bill.payment_status
                                                            }
                                                        </Badge>
                                                    </td>
                                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                                                        <Dialog
                                                            open={isDialogOpen}
                                                            onOpenChange={
                                                                setIsDialogOpen
                                                            }
                                                        >
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    variant={
                                                                        bill.payment_status ===
                                                                        "paid"
                                                                            ? "outline"
                                                                            : "default"
                                                                    }
                                                                    disabled={
                                                                        bill.payment_status ===
                                                                        "paid"
                                                                    }
                                                                    onClick={() => {
                                                                        setSelectedBill(
                                                                            bill
                                                                        );
                                                                        setIsDialogOpen(
                                                                            true
                                                                        );
                                                                    }}
                                                                    className="text-xs sm:text-sm"
                                                                >
                                                                    {bill.payment_status ===
                                                                    "paid"
                                                                        ? "Paid"
                                                                        : "Pay Now"}
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-md">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-base sm:text-lg">
                                                                        Process
                                                                        Payment
                                                                    </DialogTitle>
                                                                    <DialogDescription className="text-sm">
                                                                        Bill
                                                                        from{" "}
                                                                        {new Date(
                                                                            bill.created_at
                                                                        ).toLocaleDateString()}
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="space-y-4">
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Total
                                                                            Amount
                                                                        </p>
                                                                        <p className="text-base sm:text-lg font-medium">
                                                                            RM{" "}
                                                                            {bill.total_amount.toFixed(
                                                                                2
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <form
                                                                        onSubmit={
                                                                            handlePayment
                                                                        }
                                                                    >
                                                                        <div className="space-y-2">
                                                                            <Label
                                                                                htmlFor="paymentAmount"
                                                                                className="text-sm"
                                                                            >
                                                                                Payment
                                                                                Amount
                                                                                (RM)
                                                                            </Label>
                                                                            <Input
                                                                                id="paymentAmount"
                                                                                type="number"
                                                                                placeholder="Enter payment amount"
                                                                                value={
                                                                                    paymentAmount
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    setPaymentAmount(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                min="0.01"
                                                                                max={bill.total_amount.toFixed(
                                                                                    2
                                                                                )}
                                                                                step="0.01"
                                                                                className="text-sm sm:text-base"
                                                                            />
                                                                        </div>
                                                                        <Button
                                                                            type="submit"
                                                                            className="w-full mt-4 text-sm sm:text-base"
                                                                        >
                                                                            Process
                                                                            Payment
                                                                        </Button>
                                                                    </form>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </main>
        </>
    );
}
