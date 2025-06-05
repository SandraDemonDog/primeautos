
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/utils/authHelpers";
import { connectDB } from "@/utils/mongodb";
import User from "@/modelo/User";
import bcrypt from "bcryptjs";


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    requireAdmin(req);
    const user = await User.findById(params.id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado." }, { status: 404 });
    }
    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json({ message: "Error al obtener el usuario." }, { status: 500 });
  }
}


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    requireAdmin(req);
    const updates = await req.json();

 const allowedFields = ["name", "email", "role"];
    const updateData: any = {};


    for (const field of allowedFields) {
      if (updates[field]) updateData[field] = updates[field];
    }


    if (updates.password) {
      if (updates.password.length < 6) {
        return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres." }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(updates.password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(params.id, updateData, { new: true }).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ data: updatedUser });

  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return NextResponse.json({ error: "Este correo ya está registrado." }, { status: 400 });
    }

    console.error("Error al actualizar usuario:", error);
    return NextResponse.json({ error: "Error interno al actualizar usuario" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    requireAdmin(req);
    const deletedUser = await User.findByIdAndDelete(params.id);

    if (!deletedUser) {
      return NextResponse.json({ message: "Usuario no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    return NextResponse.json({ message: "Error al eliminar el usuario." }, { status: 500 });
  }
}
