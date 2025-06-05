// app/api/resetPassword/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/utils/mongodb";
import User from "@/modelo/User";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Token y nueva contraseña son requeridos." },
        { status: 400 }
      );
    }

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET no definido");

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Token inválido o expirado." },
        { status: 400 }
      );
    }

    const userId = payload.userId;
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Contraseña actualizada exitosamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en resetPassword:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
};

export const OPTIONS = async () => {
  return NextResponse.json(
    {},
    { status: 200, headers: { Allow: "POST, OPTIONS" } }
  );
};
