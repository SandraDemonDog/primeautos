import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import Testimonial from "@/modelo/Testimonial";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const updates = await req.json(); 

  if (!id || Object.keys(updates).length === 0) {
    return NextResponse.json({ message: "Faltan campos obligatorios o ID no proporcionado." }, { status: 400 });
  }

  await connectDB();

  try {

    if (updates.comment && (!updates.comment.es || !updates.comment.en)) {
      return NextResponse.json({ message: "Debe proporcionar comentarios en ambos idiomas." }, { status: 400 });
    }

    const result = await Testimonial.findByIdAndUpdate(
      id,
      { $set: updates }, 
      { new: true } 
    );

    if (!result) {
      return NextResponse.json({ message: "No se encontró el testimonio." }, { status: 404 });
    }

    return NextResponse.json({ data: result, message: "Testimonio actualizado correctamente." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error al actualizar el testimonio." }, { status: 500 });
  }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  await connectDB();

  try {
    const result = await Testimonial.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ message: "No se encontró el testimonio" }, { status: 404 });
    }

    return NextResponse.json({ message: "Testimonio eliminado correctamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error al eliminar el testimonio" }, { status: 500 });
  }
}
