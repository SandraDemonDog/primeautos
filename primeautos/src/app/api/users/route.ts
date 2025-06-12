import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/utils/authHelpers";
import { connectDB } from "@/utils/mongodb";
import User from "@/modelo/User";
import bcrypt from "bcryptjs";

interface MongoError {
  code?: number;
  keyPattern?: Record<string, unknown>;
}

// GET - Obtener todos los usuarios
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
    return NextResponse.json(
      { error: "No autorizado o error interno" },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo usuario
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

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
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

    const userData = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    return NextResponse.json({ data: userData }, { status: 201 });

  } catch (error: unknown) {
    const mongoError = error as MongoError;

    if (mongoError.code === 11000 && mongoError.keyPattern?.email) {
      return NextResponse.json(
        { error: "El correo electrónico ya está registrado." },
        { status: 400 }
      );
    }

    console.error("Error al crear usuario:", error);
    return NextResponse.json(
      { error: "Error interno al crear el usuario" },
      { status: 500 }
    );
  }
}
