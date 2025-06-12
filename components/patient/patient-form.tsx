"use client";

import { useState } from "react";
import supabase from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type FormData = {
    name: string;
    ic: string;
    email: string;
    phone_number: string;
    phone: string;
    address: string;
    gender: string;
    blood_type: string;
    emergency_contact: string;
    status: string;
};

type PatientFormProps = {
    onSuccess?: () => void;
};

export default function PatientForm({ onSuccess }: PatientFormProps) {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        ic: "",
        email: "",
        phone_number: "",
        phone: "",
        address: "",
        gender: "",
        blood_type: "",
        emergency_contact: "",
        status: "active",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.ic || !formData.phone_number) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase.from("fh_patients").insert({
                name: formData.name,
                ic: formData.ic,
                email: formData.email,
                phone_number: formData.phone_number,
                phone: formData.phone,
                address: formData.address,
                gender: formData.gender,
                blood_type: formData.blood_type,
                emergency_contact: formData.emergency_contact,
                status: formData.status,
            });

            if (error) throw error;

            toast.success("Patient added successfully");
            setFormData({
                name: "",
                ic: "",
                email: "",
                phone_number: "",
                phone: "",
                address: "",
                gender: "",
                blood_type: "",
                emergency_contact: "",
                status: "active",
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error adding patient:", error);
            toast.error("Failed to add new patient");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                        Personal Information
                    </h3>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Full Name{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ic">
                                Identification Number{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="ic"
                                value={formData.ic}
                                onChange={(e) =>
                                    handleChange("ic", e.target.value)
                                }
                                placeholder="000000-00-0000"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(value) =>
                                    handleChange("gender", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">
                                        Female
                                    </SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="blood_type">Blood Type</Label>
                            <Select
                                value={formData.blood_type}
                                onValueChange={(value) =>
                                    handleChange("blood_type", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select blood type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["A", "B", "AB", "O"].map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                                placeholder="patient@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone_number">
                                Phone Number{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="phone_number"
                                value={formData.phone_number}
                                onChange={(e) =>
                                    handleChange("phone_number", e.target.value)
                                }
                                placeholder="+60123456789"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emergency_contact">
                                Emergency Contact
                            </Label>
                            <Input
                                id="emergency_contact"
                                value={formData.emergency_contact}
                                onChange={(e) =>
                                    handleChange(
                                        "emergency_contact",
                                        e.target.value
                                    )
                                }
                                placeholder="+60123456789"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) =>
                                handleChange("address", e.target.value)
                            }
                            placeholder="Full address including postal code"
                            rows={3}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[150px]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Patient"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
