
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/utils/mongodb";
import User from "@/modelo/User";
import sendEmail from "../emailService/route";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "El correo es obligatorio" },
        { status: 400 }
      );
    }


    const user = await User.findOne({ email });
    if (!user) {

      return NextResponse.json(
        { success: true, message: "Si el correo está registrado, se enviará un enlace para restablecer la contraseña" },
        { status: 200 }
      );
    }


    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET no definido");
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

    const subject = "Restablecer tu contraseña - Prime Autos";
    const text = `Hola,\n\nPara restablecer tu contraseña, haz clic en el siguiente enlace:\n${resetLink}\n\nEl enlace expira en 15 minutos.\n\nSi no solicitaste este cambio, ignora este correo.`;

    await sendEmail(email, subject, text);

    return NextResponse.json(
      { success: true, message: "Si el correo está registrado, se enviará un enlace para restablecer la contraseña." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en forgotPassword:", error);
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
