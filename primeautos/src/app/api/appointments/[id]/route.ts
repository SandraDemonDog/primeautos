import { NextRequest, NextResponse } from "next/server";
import Appointment from "@/modelo/Appointment";
import { connectDB } from "@/utils/mongodb";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const verifyAdmin = async (req: NextRequest): Promise<true | NextResponse> => {
  try {
    const token = req.cookies.get("refreshToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No autorizado: Token no proporcionado." },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET no está definido en las variables de entorno.");
      return NextResponse.json(
        { success: false, message: "Error interno del servidor." },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "No autorizado: Solo administradores." },
        { status: 403 }
      );
    }

    return true;
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return NextResponse.json(
      { success: false, message: "No autorizado: Token inválido o expirado." },
      { status: 401 }
    );
  }
};

interface AppointmentUpdate {
  name?: string;
  email?: string;
  telephone?: string;
  date?: string;
  time?: string;
  status?: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await verifyAdmin(req);
  if (adminCheck !== true) return adminCheck;

  try {
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const allowedFields: (keyof AppointmentUpdate)[] = [
      "name",
      "email",
      "telephone",
      "date",
      "time",
      "status",
    ];

    const updates = allowedFields.reduce((acc, key) => {
      if (key in body) {
        acc[key] = body[key];
      }
      return acc;
    }, {} as AppointmentUpdate);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No hay campos válidos." },
        { status: 400 }
      );
    }

    await connectDB();
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { success: false, message: "Cita no encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedAppointment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await verifyAdmin(req);
  if (adminCheck !== true) return adminCheck;

  try {
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido." },
        { status: 400 }
      );
    }

    await connectDB();
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return NextResponse.json(
        { success: false, message: "Cita no encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Cita eliminada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
