

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (req: NextRequest) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("❌ JWT_SECRET no está definido");
      return NextResponse.json(
        { success: false, message: "Configuración inválida del servidor" },
        { status: 500 }
      );
    }

    const refreshToken = req.cookies.get("refreshToken")?.value;
    console.log("🔐 Refresh Token recibido:", refreshToken);

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "No hay Refresh Token" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(refreshToken, secret) as {
      userId: string;
      email: string;
      role: string;
    };
    console.log("✅ Refresh Token decodificado:", decoded);

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role },
      secret,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ success: false, message: "Token expirado" }, { status: 403 });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ success: false, message: "Token inválido" }, { status: 403 });
    }

    console.error("Error inesperado al refrescar token:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
};
