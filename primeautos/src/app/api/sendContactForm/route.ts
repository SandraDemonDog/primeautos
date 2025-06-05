import { NextRequest, NextResponse } from "next/server"; 
import { connectDB } from "@/utils/mongodb"; 
import ContactForm from "@/modelo/ContactForm"; 


export async function GET(req: NextRequest) {
  await connectDB();
  try {
   
    const messages = await ContactForm.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener mensajes." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connectDB(); 

  try {
    const { name, email, message } = await req.json();


    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Por favor, completa todos los campos obligatorios.",
        },
        { status: 400 }
      );
    }

    const newMessage = new ContactForm({ name, email, message });
    await newMessage.save();

    return NextResponse.json(
      {
        success: true,
        message: "Tu mensaje ha sido enviado con éxito.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al procesar el formulario:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Hubo un error al enviar tu mensaje. Intenta de nuevo más tarde.",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const deletedMessage = await ContactForm.findByIdAndDelete(params.id);
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


