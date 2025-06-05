
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";
import Rating from "@/modelo/Rating"; 
import Service from "@/modelo/Service"; 
import mongoose from "mongoose";


  export const PATCH = async (req: NextRequest, context: { params: { id: string } }) => {
    try{
        const params = await context.params;
        const id = (params.id || "").trim(); 
        
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
              { success: false, message: "ID inválido." },
              { status: 400 }
            );
          }

        await connectDB();  

        const updates = await req.json(); 
    
    
        if (!id || Object.keys(updates).length === 0) {
            return NextResponse.json(
                { message: "Faltan campos obligatorios o ID no proporcionado." },
                { status: 400 }
            );
        }

        const result = await Rating.findByIdAndUpdate(
        id,
        { $set: updates }, 
        { new: true } 
        );

        if (!result) {
            return NextResponse.json(
                { message: "No se encontró la valoración." },
                { status: 404 }
            );
        }
        

        const ratings = await Rating.find({ serviceId: result.serviceId });
        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

        await Service.findByIdAndUpdate(
        result.serviceId,
        { averageRating },
        { new: true }
        );

        return NextResponse.json(
        { data: result, message: "Valoración actualizada correctamente." },
        { status: 200 }
        );
        
   
    } catch (error) {
        console.error("Error al actualizar la valoración:", error);
        return NextResponse.json(
        { message: "Error al actualizar la valoración." },
        { status: 500 }
        );
    }
    }

export const DELETE = async (req: NextRequest, context: {params: {id: string }}) => {
  

  try {
    const params = await context.params;
    const id = (params.id || "").trim();

    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido." },
        { status: 400 }
      );
    }

    await connectDB();
    
    const result = await Rating.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { message: "No se encontró la valoración." },
        { status: 404 }
      );
    }

    
    const ratings = await Rating.find({ serviceId: result.serviceId });
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    await Service.findByIdAndUpdate(
      result.serviceId,
      { averageRating },
      { new: true }
    );

    return NextResponse.json(
      { message: "Valoración eliminada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar la valoración:", error);
    return NextResponse.json(
      { message: "Error al eliminar la valoración." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json(
      { message: "ID no proporcionado." },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const result = await Rating.findById(id).populate("serviceId");

    if (!result) {
      return NextResponse.json(
        { message: "No se encontró la valoración." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: result, message: "Valoración obtenida correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener la valoración:", error);
    return NextResponse.json(
      { message: "Error al obtener la valoración." },
      { status: 500 }
    );
  }
}
