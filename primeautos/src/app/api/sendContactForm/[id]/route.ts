import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import ContactForm from "@/modelo/ContactForm";

export async function DELETE( req: NextRequest, context: { params: { id: string } }) {
  await connectDB();

  const { id } = await Promise.resolve(context.params);
  console.log("Eliminando mensaje con id:", id);

  try {
    const deletedMessage = await ContactForm.findByIdAndDelete(id);
    if (!deletedMessage) {
      return NextResponse.json(
        { success: false, message: "Mensaje no encontrado." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Mensaje eliminado correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el mensaje:", error);
    return NextResponse.json(
      { success: false, message: "Error al eliminar el mensaje." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { Allow: "DELETE,OPTIONS" } });
}
