
import { NextRequest, NextResponse } from "next/server";
import Appointment from "@/modelo/Appointment";
import { connectDB } from "@/utils/mongodb";
import { requireUser } from "@/utils/authHelpers";

export const GET = async (req: NextRequest) => {
  try {
    const user = requireUser(req);  
    await connectDB();
    const appointments = await Appointment.find({ email: user.email });

    return NextResponse.json({ success: true, data: appointments }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 401 });
  }
};



