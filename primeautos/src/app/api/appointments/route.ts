import { connectDB } from "@/utils/mongodb";
import Appointment from "@/modelo/Appointment";
import { NextRequest, NextResponse } from "next/server";
import sendEmail from "../emailService/route";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url!);
    const date = searchParams.get("date");

    const appointments = date
      ? await Appointment.find({ date })
      : await Appointment.find();

    return NextResponse.json({ success: true, data: appointments }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return NextResponse.json({ success: false, message: "Error interno del servidor." }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, telephone, date, time, status } = body;

    if (!name || !email || !telephone || !date || !time || !status) {
      return NextResponse.json(
        { success: false, message: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    const existingAppointment = await Appointment.findOne({ date, time });
    if (existingAppointment) {
      return NextResponse.json(
        { success: false, message: "La hora seleccionada ya está ocupada." },
        { status: 400 }
      );
    }

    const newAppointment = new Appointment({ name, email, telephone, date, time, status: "Pendiente" });
    const savedAppointment = await newAppointment.save();

    await sendEmail(email, "Confirmación de Cita", `Hola ${name}, tu cita ha sido agendada para ${date} a las ${time}.`);

    return NextResponse.json({ success: true, data: savedAppointment, message: "Cita agendada con éxito." }, { status: 201 });
  } catch (error) {
    console.error("Error al guardar la cita:", error);
    return NextResponse.json({ success: false, message: "Error interno del servidor." }, { status: 500 });
  }
};
