
import { NextRequest, NextResponse } from "next/server";
import Appointment from "@/modelo/Appointment";
import { connectDB } from "@/utils/mongodb";
import mongoose from "mongoose";
import { getUserFromToken, getUserEmail } from "@/utils/authHelpers";


interface AppointmentUpdates {
  name?: string;
  telephone?: string;
  date?: string;
  time?: string;
}

export const PATCH = async (
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> => {
  try {
    const userEmail = getUserFromToken(req);
    if (!userEmail) {
      return NextResponse.json({ success: false, message: "No autorizado." }, { status: 401 });
    }

    const id = (context.params.id || "").trim();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "ID inválido." }, { status: 400 });
    }

    const body = await req.json();
    const allowedFields: (keyof AppointmentUpdates)[] = ["name", "telephone", "date", "time"];
    const updates: AppointmentUpdates = Object.keys(body)
      .filter((key) => allowedFields.includes(key as keyof AppointmentUpdates))
      .reduce((obj, key) => {
        obj[key as keyof AppointmentUpdates] = body[key];
        return obj;
      }, {} as AppointmentUpdates);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, message: "No hay campos válidos para actualizar." }, { status: 400 });
    }

    await connectDB();
    const appointment = await Appointment.findOne({ _id: id, email: userEmail });
    if (!appointment) {
      return NextResponse.json({ success: false, message: "No autorizado." }, { status: 404 });
    }

    if (updates.date) {
      const newDate = new Date(updates.date);
      if (isNaN(newDate.getTime())) {
        return NextResponse.json({ success: false, message: "Fecha inválida." }, { status: 400 });
      }
      updates.date = newDate.toISOString();
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: updatedAppointment }, { status: 200 });
  } catch (err) {
    console.error("Error actualizando cita:", err);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> => {
  try {
    const id = context.params.id?.trim();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido." },
        { status: 400 }
      );
    }

    const userEmail = getUserEmail(req);
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "No autorizado." },
        { status: 401 }
      );
    }

    await connectDB();
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json(
        { success: false, message: "Cita no encontrada." },
        { status: 404 }
      );
    }

    // Verificar si el email del dueño coincide
    if (appointment.email !== userEmail) {
      console.warn(`Intento de eliminar cita no autorizada. Dueño: ${appointment.email}, Usuario: ${userEmail}`);
      return NextResponse.json(
        { success: false, message: "No autorizado para eliminar esta cita." },
        { status: 403 }
      );
    }

    const deleted = await Appointment.findByIdAndDelete(id);
    return NextResponse.json({ success: true, data: deleted }, { status: 200 });
  } catch (err) {
    console.error("Error eliminando cita:", err);
    return NextResponse.json(
      { success: false, message: "Error interno" },
      { status: 500 }
    );
  }
};

