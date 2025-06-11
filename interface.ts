export interface Medicine {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    price: number;
    supplier?: string;
    expiry_date?: string;
    category?: string;
    batch_number?: string;
    created_at?: string;
}

export type Prescription = {
    id: string;
    appointment_id: number | null;
    diagnosis: string | null;
    notes: string | null;
    medicine_ids: number[];
    prescribed_by: number | null;
    created_at: string | null;
    patient_id: string;
    status: string | null;
};

export type FormDataPatient = {
    name: string;
    ic: string;
    email: string;
    phone_number: string;
    phone: string;
    address: string;
    gender: string;
    blood_type: string;
    emergency_contact: string;
    condition: string;
    status: string;
};

export interface Patient {
    id: string;
    name: string;
    ic: string;
    email?: string;
    phone_number?: string;
    phone?: string;
    blood_type?: string;
    gender?: string;
    address?: string;
    emergency_contact?: string;
    status?: string;
    condition: string;
    prescription?: Prescription;
}

export interface Bill {
    id: string;
    total_amount: number;
    payment_status: string;
    created_at: string;
    patient_id: string;
}

export interface DoctorProfile {
    full_name: string;
    specialization: string;
    email: string;
    phone?: string;
    address?: string;
    available_days?: string;
}

export interface UserProfile {
    full_name: string;
    email: string;
    phone?: string;
    address?: string;
    avatar?: string;
}

export interface User {
    username: string;
    role: string;
    profile: UserProfile;
}

export interface Appointment {
    id: string;
    scheduled_at: string;
    status: "confirmed" | "pending" | "cancelled" | "scheduled" | null;
    created_at?: string | null;
    name: string;
    email: string;
    phone: string;
    message: string;
    doctor_id?: string | null;
    type?: string | null;
    remarks?: string | null;
}
