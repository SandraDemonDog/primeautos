import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/utils/authHelpers";
import { connectDB } from "@/utils/mongodb";
import User from "@/modelo/User";

export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });
    }

    await User.findByIdAndDelete(user.userId);

    const response = NextResponse.json({ success: true, message: "Cuenta eliminada" });
    response.cookies.set("refreshToken", "", { httpOnly: true, maxAge: 0, path: "/" }); 

    return response;
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    return NextResponse.json({ success: false, message: "Error del servidor" }, { status: 500 });
  }
}
