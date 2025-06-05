
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import User from "@/modelo/User";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Se requieren email y contraseña" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "El usuario ya existe" },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || "usuario",
    });

    await newUser.save();

    return NextResponse.json(
      { success: true, message: "Usuario registrado exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
};

export const OPTIONS = async () => {
  return NextResponse.json(
    {},
    { status: 200, headers: { Allow: "POST,OPTIONS" } }
  );
};
