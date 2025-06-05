import axios from "axios";
import AppointmentClient from "./AppointmentClient";


export default async function AppointmentClientPage() {
  try {

    const response = await axios.get("http://localhost:3000/api/appointments", {
      headers: { "Content-Type": "application/json" },
    });

    return <AppointmentClient />;
  } catch (error) {
    console.error("Error al obtener las citas pendientes:", error);

    return (
      <div className="container my-5">
        <h2 className="text-danger text-center">Hubo un error al cargar las citas.</h2>
      </div>
    );
  }
}
