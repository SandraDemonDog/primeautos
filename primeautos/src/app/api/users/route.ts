import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/utils/authHelpers";
import { connectDB } from "@/utils/mongodb";
import User from "@/modelo/User";
import bcrypt from "bcryptjs";


export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    await connectDB();

    const users = await User.find({}, "_id name email role"); 

    const sanitizedUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    }));

    return NextResponse.json({ data: sanitizedUsers });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json({ error: "No autorizado o error interno" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    await connectDB();
    const { name, email, role, password } = await req.json();

     if (!name || !email || !role || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres." }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "El correo electrónico ya está registrado." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, role, password: hashedPassword });
    await newUser.save();

    const { password: _, ...userData } = newUser.toObject();
    return NextResponse.json({ data: userData }, { status: 201 });
    } catch (error: any) {
    if (error.code === 11000 && error.keyPattern?.email) {
        return NextResponse.json({ error: "El correo electrónico ya está registrado." }, { status: 400 });
    }
    console.error("Error al crear usuario:", error);
    return NextResponse.json({ error: "Error interno al crear el usuario" }, { status: 500 });
    }

}
