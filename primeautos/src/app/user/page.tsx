

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; 


interface SessionUser {
  userId: string;
  email: string;
  role: "admin" | "usuario";
  exp: number;
}

interface Appointment {
  _id: string;
  date: string;
  time: string;
  service: string;
  status: string;
}

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<SessionUser | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const router = useRouter();

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const res = await axios.get("/api/verifyToken", { withCredentials: true });
        if (res.data?.success && res.data.decoded) {
          const decoded = res.data.decoded;
          setUser({
            userId: decoded._id,
            email: decoded.email,
            role: decoded.role,
            exp: decoded.exp,
          });
          setEmail(decoded.email);
        } else {
          console.error("No se pudo obtener la sesión del usuario.");
        }
      } catch (err) {
        console.error("Error al obtener la sesión del usuario:", err);
        router.push("/login");
      }
    };

    setMounted(true);
    fetchUserSession();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/appointmentsUser", { withCredentials: true });
        if (response.data.success) {
          setAppointments(response.data.data || response.data.appointments);
        } else {
          setError("No se pudieron obtener las citas");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Error interno al obtener las citas");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [mounted]);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/logout", {}, { withCredentials: true });
      if (response.status === 200) {
        router.push("/login");
      } else {
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const payload: { email?: string; password?: string } = {};
      if (email) payload.email = email;
      if (password) payload.password = password;

      const res = await axios.put("/api/users/update", payload, { withCredentials: true });

      if (res.data.success) {
        alert("✅ Datos actualizados correctamente.");
        setUser((prev) => (prev ? { ...prev, email: res.data.user.email } : null));
      } else {
        alert("⚠️ No se pudo actualizar.");
      }
    } catch (err) {
      console.error("❌ Error al actualizar:", err);
      alert("❌ Error al actualizar.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.")) return;

    try {
      const res = await axios.delete("/api/users/delete", { withCredentials: true });
      if (res.data.success) {
        alert("🗑️ Cuenta eliminada correctamente.");
        router.push("/login");
      } else {
        alert("⚠️ No se pudo eliminar la cuenta.");
      }
    } catch (err) {
      console.error("❌ Error al eliminar cuenta:", err);
      alert("❌ Error al eliminar cuenta.");
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm("¿Deseas cancelar esta cita?")) return;

    try {
      const res = await axios.delete(`/api/appointmentsUser/${appointmentId}`, { withCredentials: true });
      if (res.data.success) {
        setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
        alert("🗑️ Cita eliminada correctamente.");
      } else {
        alert("⚠️ No se pudo eliminar la cita.");
      }
    } catch (err) {
      console.error("❌ Error al eliminar cita:", err);
      alert("❌ Error al eliminar cita.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-4">Mi Perfil</h1>

      {user ? (
        <div className="mb-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
            <input
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nueva Contraseña (opcional)</label>
            <div className="relative w-full max-w-md">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded pr-10"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button buttonLabel="Guardar Cambios" onButtonClick={handleUpdate} buttonType="light" />
            <Button buttonLabel="Eliminar Cuenta" onButtonClick={handleDelete} buttonType="dark" />
          </div>

          <div className="mt-6">
            <Button
              buttonLabel="Cerrar Sesión"
              onButtonClick={handleLogout}
              buttonType="light"
              className="bg-red-500 hover:bg-red-600 text-white"
            />
          </div>
        </div>
      ) : (
        <p className="mb-6">No se pudo recuperar la información del usuario.</p>
      )}

      <h2 className="text-2xl font-bold mb-4">Mis Citas</h2>

      {loading ? (
        <p className="text-gray-600">Cargando citas...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">No tienes citas programadas.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 rounded shadow-md bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hora</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentAppointments.map((appointment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {new Date(appointment.date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">{appointment.time}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        appointment.status === "pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : appointment.status === "confirmada"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-700"
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteAppointment(appointment._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-4 py-1 text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
