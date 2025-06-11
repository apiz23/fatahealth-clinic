"use client";

import { useState } from "react";
import { Patient } from "@/interface";
import supabase from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddPrescriptionDialog from "@/components/prescriptions/prescription-add";
import PrescriptionList from "@/components/prescriptions/prescription-list";

export default function PrescriptionPage() {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
	const [patientSearchTerm, setPatientSearchTerm] = useState("");
	const [prescriptionSearchTerm, setPrescriptionSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);

	const fetchPatients = async () => {
		setLoading(true);
		try {
			const { data, error } = await supabase
				.from("fh_patients")
				.select("*")
				.ilike("name", `%${patientSearchTerm}%`);

			if (error) throw error;
			setPatients(data || []);
		} catch (error) {
			console.error("Error fetching patients:", error);
		} finally {
			setLoading(false);
		}
	};

	const handlePatientSearch = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await fetchPatients();
	};

	return (
		<div className="p-6 space-y-6">
			{/* Patient Search */}
			<form
				onSubmit={handlePatientSearch}
				className="flex flex-col md:flex-row gap-4 items-start md:items-end"
			>
				<Input
					type="text"
					placeholder="Search patients by name"
					value={patientSearchTerm}
					onChange={(e) => setPatientSearchTerm(e.target.value)}
					className="w-full md:w-[300px]"
				/>
				<Button type="submit" disabled={loading}>
					{loading ? "Searching..." : "Search Patient"}
				</Button>
			</form>

			{/* Display Searched Patients */}
			{patients.length > 0 && (
				<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
					{patients.map((patient) => (
						<div
							key={patient.id}
							className={`flex flex-col p-4 rounded-lg shadow cursor-pointer ${
								selectedPatient?.id === patient.id ? "bg-blue-100" : "bg-white"
							}`}
							onClick={() => setSelectedPatient(patient)}
						>
							<div className="flex items-center mb-2">
								<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
									<span className="text-xl font-bold text-gray-600">
										{patient.name.charAt(0).toUpperCase()}
									</span>
								</div>
								<p className="font-semibold text-lg">{patient.name}</p>
							</div>
							<div className="text-sm text-gray-600 space-y-1">
								<p>IC: {patient.ic}</p>
								<p>Phone Number: {patient.phone_number}</p>
							</div>
						</div>
					))}
				</div>
			)}

			{selectedPatient && (
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">Prescriptions</h2>
						{selectedPatient?.id && (
							<AddPrescriptionDialog patientId={selectedPatient.id} />
						)}
					</div>

					<Input
						type="text"
						placeholder="Search prescriptions..."
						value={prescriptionSearchTerm}
						onChange={(e) => setPrescriptionSearchTerm(e.target.value)}
						className="w-full md:w-1/2"
					/>

					{selectedPatient?.id && (
						<PrescriptionList
							patientId={selectedPatient.id}
							searchTerm={prescriptionSearchTerm}
						/>
					)}
				</div>
			)}
		</div>
	);
}
