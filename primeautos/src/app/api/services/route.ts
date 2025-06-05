import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/utils/mongodb";
import Service from "@/modelo/Service";

export async function GET() {
  await connectDB();

  try {
   
    const services = await Service.find({}, {
      name: 1, 
      description: 1,
      price: 1,
      vehicleType: 1,
      averageRating: 1, 
      featured: 1,
    });

    return NextResponse.json({ success: true, data: services }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los servicios:", error);
    return NextResponse.json({ success: false, message: "Error al obtener los servicios." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {

    const body = await req.json();

    if (!body.name || !body.description || !body.price || !body.vehicleType) {
      return NextResponse.json(
        { success: false, message: "Por favor, proporciona todos los campos obligatorios." },
        { status: 400 }
      );
    }

 
    const newService = new Service(body);
    await newService.save();

    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error) {
    console.error("Error al crear el servicio:", error);
    return NextResponse.json({ success: false, message: "Error al crear el servicio." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();

  try {

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID no proporcionado." }, { status: 400 });
    }

    const deletedService = await Service.findByIdAndDelete(id);


    if (!deletedService) {
      return NextResponse.json({ success: false, message: "Servicio no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Servicio eliminado con éxito." }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    return NextResponse.json({ success: false, message: "Error al eliminar el servicio." }, { status: 500 });
  }
}

