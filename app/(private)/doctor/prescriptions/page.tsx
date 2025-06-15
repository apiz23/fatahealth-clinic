"use client";

import { useEffect, useState } from "react";
import { Patient } from "@/interface";
import supabase from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import AddPrescriptionDialog from "@/components/prescriptions/prescription-add";
import PrescriptionList from "@/components/prescriptions/prescription-list";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination";

const PATIENTS_PER_PAGE = 3;

export default function PrescriptionPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
        null
    );
    const [patientSearchTerm, setPatientSearchTerm] = useState("");
    const [prescriptionSearchTerm, setPrescriptionSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                let query = supabase.from("fh_patients").select("*");

                if (patientSearchTerm.trim() !== "") {
                    query = query.ilike("name", `%${patientSearchTerm}%`);
                }

                const { data, error } = await query;

                if (error) throw error;
                setPatients(data || []);
                setCurrentPage(1);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };

        fetchPatients();
    }, [patientSearchTerm]);

    const totalPages = Math.ceil(patients.length / PATIENTS_PER_PAGE);
    const paginatedPatients = patients.slice(
        (currentPage - 1) * PATIENTS_PER_PAGE,
        currentPage * PATIENTS_PER_PAGE
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                <Input
                    type="text"
                    placeholder="Search patients by name"
                    value={patientSearchTerm}
                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                    className="w-full md:w-[300px]"
                />
            </div>

            {paginatedPatients.length > 0 ? (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {paginatedPatients.map((patient) => (
                            <div
                                key={patient.id}
                                className={`flex flex-col p-4 rounded-lg shadow cursor-pointer bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-900/50 border-gray-200 dark:border-neutral-700" ${
                                    selectedPatient?.id === patient.id
                                        ? "border border-cyan-200"
                                        : ""
                                }`}
                                onClick={() => setSelectedPatient(patient)}
                            >
                                <div className="flex items-center mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                        <span className="text-xl font-bold text-gray-600">
                                            {patient.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="font-semibold text-lg text-black dark:text-white">
                                        {patient.name}
                                    </p>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-200 space-y-1">
                                    <p>IC: {patient.ic}</p>
                                    <p>Phone Number: {patient.phone_number}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.max(prev - 1, 1)
                                            )
                                        }
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === i + 1}
                                            onClick={() =>
                                                setCurrentPage(i + 1)
                                            }
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(prev + 1, totalPages)
                                            )
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
            ) : (
                <p className="text-gray-400">No patients found.</p>
            )}

            {selectedPatient && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Prescriptions</h2>
                        <AddPrescriptionDialog patientId={selectedPatient.id} />
                    </div>

                    <Input
                        type="text"
                        placeholder="Search prescriptions..."
                        value={prescriptionSearchTerm}
                        onChange={(e) =>
                            setPrescriptionSearchTerm(e.target.value)
                        }
                        className="w-full md:w-1/2"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <PrescriptionList
                            patientId={selectedPatient.id}
                            searchTerm={prescriptionSearchTerm}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
