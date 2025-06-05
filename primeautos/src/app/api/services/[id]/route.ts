import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import Service from "@/modelo/Service"; 
import Rating from "@/modelo/Rating";


export async function GET(req: NextRequest, context: { params : { id: string }}) {

  try {
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID no proporcionado." },
        { status: 400 }
      );
    }

    await connectDB();

    const service = await Service.findById(id).lean(); 

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Servicio no encontrado." },
        { status: 404 }
      );
    }


    const ratings = await Rating.find({ serviceId: id });


    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;


    return NextResponse.json(
      {
        success: true,
        data: { ...service, ratings, averageRating },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener datos del servicio:", error);
    return NextResponse.json(
      { success: false, message: "Hubo un error al procesar la solicitud." },
      { status: 500 }
    );
  }
}

export const PATCH = async (req: NextRequest, context: { params: { id: string } }) => {
 
  try {

    const params  = await context.params; 

    const id = (params.id || "").trim();

    if (!id) {
      return NextResponse.json({ message: "ID no proporcionado." }, { status: 400 });
    }

    const body = await req.json(); 
    console.log("Request body:", body);
    

    if (!body || !Object.keys(body).length) {
      return NextResponse.json({ message: "El cuerpo de la solicitud está vacío." }, { status: 400 });
    }
    await connectDB();

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { $set: body }, 
      {
        new: true, 
        runValidators: true, 
      }
    );

    if (!updatedService) {
      return NextResponse.json({ message: "Servicio no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ data: updatedService, message: "Servicio actualizado correctamente." }, { status: 200});
  } catch (error) {
    console.error("Error al actualizar el servicio:", error);
    return NextResponse.json({ message: "Error interno al actualizar el servicio." }, { status: 500 });
  }
}

export const DELETE = async (req: NextRequest, context: { params: { id: string } }) => {
  
  try {

    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ succes: false, message: "ID inválido." }, { status: 400 });
    }
    
    await connectDB();

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return NextResponse.json(
        { success: false, message: "Servicio no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Servicio eliminado con éxito." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    return NextResponse.json(
      { message: "Error interno al eliminar el servicio." },
      { status: 500 }
    );
  }
}

