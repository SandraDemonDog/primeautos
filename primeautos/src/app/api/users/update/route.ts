import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/utils/authHelpers";
import { connectDB } from "@/utils/mongodb";
import User from "@/modelo/User";
import bcrypt from "bcryptjs";

interface UserUpdateData {
  email?: string;
  password?: string;
}


export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });
    }

    const { email, password } = await req.json();

    const updateData: Partial<UserUpdateData> = {};

    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(user.userId, updateData, {
      new: true,
      select: "email role", 
    });

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(" Error al actualizar usuario:", error);
    return NextResponse.json({ success: false, message: "Error del servidor" }, { status: 500 });
  }
}
