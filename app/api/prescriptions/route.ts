import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
	const { data, error } = await supabase
		.from("fh_prescriptions")
		.select(
			"id, appointment_id, diagnosis, notes, prescribed_by, created_at, patient_id"
		)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching prescriptions:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data);
}
