
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface DecodedUser {
  userId: string;
  email: string;
  role: string;
}

export function getUserFromToken(req: NextRequest): DecodedUser | null {
  try {
    const cookie = req.cookies.get("refreshToken"); // <- CORRECTO

    if (!cookie || !cookie.value) {
      console.warn("⚠️ Token no encontrado en cookies.");
      return null;
    }

    const token = cookie.value;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("❌ JWT_SECRET no está definido.");
      return null;
    }

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    if (!decoded || typeof decoded !== "object") {
      console.error("❌ Token decodificado no válido.");
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    console.error("❌ Error al verificar el token:", err);
    return null;
  }
}

export function requireUser(req: NextRequest): DecodedUser {
  const user = getUserFromToken(req);
  if (!user || user.role !== "usuario") {
    throw new Error("No autorizado: solo usuarios.");
  }
  return user;
}

export function requireAdmin(req: NextRequest): DecodedUser {
  const user = getUserFromToken(req);
  if (!user || user.role !== "admin") {
    throw new Error("Acceso denegado: solo administradores.");
  }
  return user;
}


// Solo devuelve el email del usuario autenticado
export function getUserEmail(req: NextRequest): string | null {
  const user = getUserFromToken(req);
  return user?.email || null;
}
