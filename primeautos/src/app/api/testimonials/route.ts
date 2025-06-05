import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/utils/mongodb";
import Testimonial from "@/modelo/Testimonial";


export async function GET() {
    await connectDB();
    try {
      const testimonials = await Testimonial.find({});
      return NextResponse.json({ data: testimonials });
    } catch (error) {
      return NextResponse.json({ message: "Error al obtener los testimonios." }, { status: 500 });
    }
  }


export async function POST(req: NextRequest) {
    await connectDB();
    try {
      const body = await req.json();
    
    if (!body.comment || !body.comment.es || !body.comment.en) {
      return NextResponse.json({ message: "Debe proporcionar comentarios en ambos idiomas." }, { status: 400 });
    }
      const newTestimonial = new Testimonial(body);
      await newTestimonial.save();
      return NextResponse.json({ data: newTestimonial }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ message: "Error al crear el testimonio." }, { status: 500 });
    }
  }
  

  export async function DELETE(req: NextRequest) {
    await connectDB();
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      if (!id) {
        return NextResponse.json({ message: "ID no proporcionado." }, { status: 400 });
      }
      await Testimonial.findByIdAndDelete(id);
      return NextResponse.json({ message: "Testimonio eliminado con éxito." });
    } catch (error) {
      return NextResponse.json({ message: "Error al eliminar el testimonio." }, { status: 500 });
    }
  }