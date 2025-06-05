
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

console.log("JWT_SECRET en login.ts:", process.env.JWT_SECRET);
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
    
    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
      console.error("Error: JWT_SECRET no está definido en el entorno");
      return NextResponse.json(
        { success: false, message: "Error interno del servidor" },
        { status: 500 }
      );
    }
    
    try {
      const decoded = jwt.verify(token, secret);
      console.log("Token decodificado:", decoded);
      console.log("Rol del usuario:", (decoded as jwt.JwtPayload)?.role);

      return NextResponse.json({ success: true, decoded });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al verificar token:", error.message);
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 401 }
        );
      } else {
        console.error("Error desconocido:", error);
        return NextResponse.json(
          { success: false, message: "Error desconocido" },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error inesperado:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
};
