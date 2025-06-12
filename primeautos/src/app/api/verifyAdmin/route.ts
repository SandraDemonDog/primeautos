
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("refreshToken")?.value;
    console.log("Token extraído de la cookie:", token);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token no proporcionado" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error(" JWT_SECRET no está definido");
      return NextResponse.json(
        { success: false, message: "Error interno del servidor" },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    console.log("Token decodificado:", decoded);

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Acceso denegado: Solo administradores" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Administrador verificado", decoded },
      { status: 200 }
    );
  } catch (error) {
    console.error(" Error al verificar el token:", error);
    return NextResponse.json(
      { success: false, message: "Token inválido o expirado" },
      { status: 401 }
    );
  }
};

