import { NextRequest, NextResponse } from "next/server"; 
import { connectDB } from "@/utils/mongodb"; 
import Rating from "@/modelo/Rating"; 
import Service from "@/modelo/Service";

export async function POST(req: NextRequest) {
  await connectDB(); 

  try {
    const body = await req.json();
    const { serviceId, rating } = body; // Eliminé comment aquí

    if (!serviceId || typeof rating !== "number") {
      return NextResponse.json(
        {
          success: false,
          message: "Por favor, completa todos los campos obligatorios.",
        },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "La valoración debe estar entre 1 y 5 estrellas.",
        },
        { status: 400 }
      );
    }

    const newRating = new Rating(body);
    await newRating.save();

    const allRatings = await Rating.find({ serviceId }); 
    const averageRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length; 

    await Service.findByIdAndUpdate(serviceId, { averageRating });
    
    return NextResponse.json(
      {
        success: true,
        message: "Tu valoración ha sido registrada con éxito.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar la valoración:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Hubo un error al registrar tu valoración. Intenta de nuevo más tarde.",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: { Allow: "POST" } });
}
