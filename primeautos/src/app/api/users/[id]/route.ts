import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/utils/authHelpers";
import { connectDB } from "@/utils/mongodb";
import User from "@/modelo/User";
import bcrypt from "bcryptjs";

interface UserUpdateData {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
}

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
    console.error("Error al obtener el usuario:", error);
    return NextResponse.json({ message: "Error al obtener el usuario." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    requireAdmin(req);
    const updates: UserUpdateData = await req.json();

    const allowedFields: (keyof UserUpdateData)[] = ["name", "email", "role"];
    const updateData: Partial<UserUpdateData> = {};

    for (const field of allowedFields) {
      if (updates[field]) {
        updateData[field] = updates[field];
      }
    }

    if (updates.password) {
      if (updates.password.length < 6) {
        return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres." }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(updates.password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(params.id, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ data: updatedUser });

  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      "keyPattern" in error &&
      (error as { code: number; keyPattern?: Record<string, unknown> }).code === 11000 &&
      (error as { keyPattern?: Record<string, unknown> }).keyPattern?.email
    ) {
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
    console.error("Error al eliminar el usuario:", error);
    return NextResponse.json({ message: "Error al eliminar el usuario." }, { status: 500 });
  }
}
