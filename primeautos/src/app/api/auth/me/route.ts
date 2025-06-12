import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/utils/authHelpers";
import { connectDB } from "@/utils/mongodb";
import User from "@/modelo/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userFromToken = getUserFromToken(req);

    if (!userFromToken) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const user = await User.findById(userFromToken.userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("Error en /auth/me:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
