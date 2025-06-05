
import axios from "axios";
import ServicesClient from "./ServicesClient";

type Service = {
  _id: string;
  name: string;
  description: string;
  price: string;
  vehicleType: "Automóvil" | "Motocicleta" | "Camión";
  averageRating?: number; 
};


async function getServices(): Promise<Service[]> {
  try {
   
    const response = await axios.get(`${process.env.NEXT_URL}/api/services`);
    return response.data.data; 
  } catch (error) {
    console.error("Error al obtener los servicios:", error);
    throw new Error("Error al obtener los servicios");
  }
}

export default async function ServicesPage() {
  const services = await getServices(); 

  return <ServicesClient services={services} />;
}

