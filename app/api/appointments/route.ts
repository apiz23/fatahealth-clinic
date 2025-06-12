import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const { name, email, phone, message, scheduled_at } = body;

    if (!name || !email || !phone || !message || !scheduled_at) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabase.from("fh_appointments").insert([
        {
            name,
            email,
            phone,
            message,
            scheduled_at,
        },
    ]);

    if (error) {
        console.error("Error inserting appointment:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
        { message: "Appointment booked!" },
        { status: 200 }
    );
}
