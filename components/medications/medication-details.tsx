"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	PackageIcon,
	CalendarIcon,
	DollarSignIcon,
	FactoryIcon,
	BarcodeIcon,
	PillIcon,
	InfoIcon,
	BoxIcon,
} from "lucide-react";
import { SheetHeader } from "../ui/sheet";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Medicine } from "@/interface";
import { Calendar } from "../ui/calendar";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

interface MedicineDetailsProps {
	medicine: Medicine;
}

export function MedicineDetails({ medicine }: MedicineDetailsProps) {
	const [formData, setFormData] = useState<Medicine>({
		...medicine,
	});
	const [date, setDate] = useState<Date | undefined>(new Date());

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async () => {
		const { error } = await supabase
			.from("fh_medicines")
			.update({
				name: formData.name,
				description: formData.description,
				quantity: formData.quantity,
				price: formData.price,
				supplier: formData.supplier,
				expiry_date: formData.expiry_date
					? new Date(formData.expiry_date.split("-").reverse().join("-"))
					: null,
				category: formData.category,
				batch_number: formData.batch_number,
			})
			.eq("id", formData.id);

		if (error) {
			toast.error("Failed to update medicine!");
			console.error("Update error:", error);
		} else {
			toast.success("Medicine updated successfully!");
		}
	};

	return (
		<form className="h-full flex flex-col">
			<SheetHeader className="border-b pb-4 mb-4 px-6 pt-10">
				<div className="flex items-start gap-4">
					<div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center">
						<PillIcon className="h-6 w-6 text-blue-600" />
					</div>

					<div className="flex-1 space-y-3">
						<Input
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							placeholder="Medicine name"
						/>

						<div className="flex items-center gap-2">
							<Input
								name="category"
								value={formData.category}
								onChange={handleInputChange}
								placeholder="Category"
								className="flex-1"
							/>
							<Badge
								variant={formData.quantity > 0 ? "default" : "destructive"}
								className="text-xs h-6"
							>
								{formData.quantity > 0
									? `${formData.quantity} in stock`
									: "Out of stock"}
							</Badge>
						</div>
					</div>
				</div>
			</SheetHeader>

			<div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
				{/* Description Section */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-sm font-medium text-gray-500">
						<InfoIcon className="h-4 w-4" />
						<span>DESCRIPTION</span>
					</div>
					<Textarea
						name="description"
						value={formData.description || ""}
						onChange={handleInputChange}
						placeholder="Enter medicine description"
						className="min-h-[100px] bg-gray-50 border-gray-200 focus:border-blue-300"
					/>
				</div>

				{/* Grid Layout for Details */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Basic Information */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-sm font-medium text-gray-500">
							<BoxIcon className="h-4 w-4" />
							<span>BASIC INFORMATION</span>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm text-gray-500 mb-1">Price (RM)</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<DollarSignIcon className="h-4 w-4 text-gray-400" />
									</div>
									<Input
										name="price"
										type="number"
										step="0.01"
										value={formData.price}
										onChange={handleInputChange}
										className="pl-8"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm text-gray-500 mb-1">Quantity</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<PackageIcon className="h-4 w-4 text-gray-400" />
									</div>
									<Input
										name="quantity"
										type="number"
										value={formData.quantity}
										onChange={handleInputChange}
										className="pl-8"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Supplier Details */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-sm font-medium text-gray-500">
							<FactoryIcon className="h-4 w-4" />
							<span>SUPPLIER DETAILS</span>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm text-gray-500 mb-1">Supplier</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FactoryIcon className="h-4 w-4 text-gray-400" />
									</div>
									<Input
										name="supplier"
										value={formData.supplier}
										onChange={handleInputChange}
										className="pl-8"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm text-gray-500 mb-1">Batch Number</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<BarcodeIcon className="h-4 w-4 text-gray-400" />
									</div>
									<Input
										name="batch_number"
										value={formData.batch_number}
										onChange={handleInputChange}
										className="pl-8"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Expiry Information */}
				<div className="space-y-4">
					<div className="flex justify-between items-center gap-2 text-sm font-medium text-gray-500">
						<div className="flex space-x-4">
							<CalendarIcon className="h-4 w-4" />
							<span>EXPIRY INFORMATION</span>
						</div>
						{formData.expiry_date && (
							<p className="text-sm text-gray-600">
								Selected expiry date: <strong>{formData.expiry_date}</strong>
							</p>
						)}
					</div>
					<Calendar
						mode="single"
						selected={date}
						onSelect={(selectedDate) => {
							setDate(selectedDate);
							if (selectedDate) {
								const formatted = `${selectedDate
									.getDate()
									.toString()
									.padStart(2, "0")}-${(selectedDate.getMonth() + 1)
									.toString()
									.padStart(2, "0")}-${selectedDate.getFullYear()}`;
								setFormData((prev) => ({ ...prev, expiry_date: formatted }));
							}
						}}
						className="rounded-md border w-fit mx-auto"
					/>
				</div>
			</div>

			{/* Footer with Save Button */}
			<div className="border-t px-6 py-4 flex justify-end">
				<Button className="min-w-[120px]" onClick={handleSubmit}>
					Save Changes
				</Button>
			</div>
		</form>
	);
}
