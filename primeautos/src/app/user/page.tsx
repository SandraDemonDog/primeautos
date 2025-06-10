"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

interface Appointment {
  _id: string;
  date: string;
  time: string;
  service: string;
  status: string;
}

export default function ProfilePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  const { user, logout, getAccessToken, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || !user) return;

    setEmail(user.email);

    const fetchAppointments = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get("/api/appointmentsUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          setAppointments(response.data.appointments || response.data.data);
        } else {
          setError("No se pudieron obtener las citas");
        }
      } catch (err) {
        console.error("Error al obtener citas:", err);
        setError("Error interno al obtener las citas");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [authLoading, user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const payload: { email?: string; password?: string } = {};
      if (email) payload.email = email;
      if (password) payload.password = password;

      const token = await getAccessToken();
      const res = await axios.put("/api/users/update", payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.data.success) {
        alert("✅ Datos actualizados correctamente.");
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
      const token = await getAccessToken();
      const res = await axios.delete("/api/users/delete", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

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
      const token = await getAccessToken();
      const res = await axios.delete(`/api/appointmentsUser/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

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

  if (authLoading) return <div className="p-4">Cargando perfil...</div>;
  if (!user) return <div className="p-4">No se encontró el usuario.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-4">Mi Perfil</h1>

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

      <div>
        <h2 className="text-2xl font-semibold mb-4">Mis Citas</h2>

        {loading ? (
          <p>Cargando citas...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <ul className="space-y-4">
              {currentAppointments.map((a) => (
                <li key={a._id} className="p-4 border rounded bg-white">
                  <p><strong>Fecha:</strong> {a.date}</p>
                  <p><strong>Hora:</strong> {a.time}</p>
                  <p><strong>Servicio:</strong> {a.service}</p>
                  <p><strong>Estado:</strong> {a.status}</p>
                  <Button
                    buttonLabel="Cancelar"
                    onButtonClick={() => handleDeleteAppointment(a._id)}
                    buttonType="light"
                    className="mt-2 bg-red-500 hover:bg-red-400 text-red-800"
                  />
                </li>
              ))}
            </ul>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-6 flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === i + 1
                        ? "bg-yellow-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
