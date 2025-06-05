/*import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const emailHeader = req.headers.get("x-user-email");
  const allHeaders = Object.fromEntries(req.headers.entries());

  // Accedemos a las cookies usando .get() para obtener el valor específico de la cookie "refreshToken"
  const refreshToken = req.cookies.get("refreshToken");

  return NextResponse.json({
    success: true,
    message: "Debug info from API route",
    xUserEmail: emailHeader || null,
    allHeaders,
    refreshToken: refreshToken || null,
  });
};*/
