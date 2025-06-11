"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import supabase from "@/lib/supabase";
import { Medicine } from "@/interface";

interface AddMedicineDialogProps {
	onMedicineAdded: (newMedicine: Medicine) => void;
}

export function AddMedicineDialog({ onMedicineAdded }: AddMedicineDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [newMedicine, setNewMedicine] = useState<Omit<Medicine, "id">>({
		name: "",
		description: "",
		quantity: 0,
		price: 0,
		supplier: "",
		expiry_date: "",
		category: "",
		batch_number: "",
	});

	const handleAddMedicine = async () => {
		if (!newMedicine.name || !newMedicine.quantity || !newMedicine.price) {
			toast.error("Please fill in all required fields");
			return;
		}

		try {
			const { data, error } = await supabase
				.from("fh_medicines")
				.insert([newMedicine])
				.select();

			if (error) {
				throw error;
			}

			if (data && data[0]) {
				onMedicineAdded(data[0]);
				toast.success("Medicine added successfully");
				setIsOpen(false);
				setNewMedicine({
					name: "",
					description: "",
					quantity: 0,
					price: 0,
					supplier: "",
					expiry_date: "",
					category: "",
					batch_number: "",
				});
			}
		} catch (error) {
			toast.error("Failed to add medicine");
			console.error(error);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="gap-1">
					<PlusIcon className="h-4 w-4" />
					Add Medicine
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Medicine</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Name*</Label>
						<Input
							id="name"
							placeholder="Medicine name"
							value={newMedicine.name}
							onChange={(e) =>
								setNewMedicine({ ...newMedicine, name: e.target.value })
							}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="description">Description</Label>
						<Input
							id="description"
							placeholder="Description"
							value={newMedicine.description}
							onChange={(e) =>
								setNewMedicine({
									...newMedicine,
									description: e.target.value,
								})
							}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="quantity">Quantity*</Label>
							<Input
								id="quantity"
								type="number"
								placeholder="0"
								value={newMedicine.quantity}
								onChange={(e) =>
									setNewMedicine({
										...newMedicine,
										quantity: parseInt(e.target.value) || 0,
									})
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="price">Price*</Label>
							<Input
								id="price"
								type="number"
								placeholder="0.00"
								value={newMedicine.price}
								onChange={(e) =>
									setNewMedicine({
										...newMedicine,
										price: parseFloat(e.target.value) || 0,
									})
								}
							/>
						</div>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="supplier">Supplier</Label>
						<Input
							id="supplier"
							placeholder="Supplier name"
							value={newMedicine.supplier}
							onChange={(e) =>
								setNewMedicine({
									...newMedicine,
									supplier: e.target.value,
								})
							}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="expiry_date">Expiry Date</Label>
							<Input
								id="expiry_date"
								type="date"
								value={newMedicine.expiry_date}
								onChange={(e) =>
									setNewMedicine({
										...newMedicine,
										expiry_date: e.target.value,
									})
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="batch_number">Batch Number</Label>
							<Input
								id="batch_number"
								placeholder="Batch number"
								value={newMedicine.batch_number}
								onChange={(e) =>
									setNewMedicine({
										...newMedicine,
										batch_number: e.target.value,
									})
								}
							/>
						</div>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="category">Category</Label>
						<Input
							id="category"
							placeholder="Category"
							value={newMedicine.category}
							onChange={(e) =>
								setNewMedicine({
									...newMedicine,
									category: e.target.value,
								})
							}
						/>
					</div>
					<Button type="button" onClick={handleAddMedicine} className="mt-2">
						Add Medicine
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
