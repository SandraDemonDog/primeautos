
"use client";

import { useState, useEffect } from "react";
import ServicesForm from "./servicesForm";
import TestimonialForm from "./testimonialsForm";
import AppointmentsForm from "./appointmentsForm";
import AdminTranslationsPanel from "./adminTranslationPanel";
import AdminMessagesPanel from "./adminMessages";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import axios from "axios";
import UsersPanel from "./userPanel";

export default function AdminPage() {
  const [currentTab, setCurrentTab] = useState<"appointments" | "services" | "testimonials" | "messages" | "translations" | "users">("appointments");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchAdminSession = async () => {
      try {
        const res = await axios.get("/api/verifyAdmin", { withCredentials: true });

        if (res.data?.success) {
          setUserEmail(res.data.decoded.email || "Administrador");
          setIsAuthenticated(true);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Error al verificar sesión del admin:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminSession();
  }, [router]);

  if (loading) {
    return <div className="text-center py-8 text-gray-700">Verificando acceso de administrador...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto bg-white transition-all h-screen">
      {/* Panel lateral ajustado */}
      <aside className="w-1/6 bg-gray-200 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-base font-semibold mb-2">Admin</h2>
          <p className="text-xs text-gray-700 mb-4 break-words">{userEmail}</p>

          <ul className="space-y-2 text-sm">
            {[
              { label: "Citas", value: "appointments" },
              { label: "Servicios", value: "services" },
              { label: "Testimonios", value: "testimonials" },
              { label: "Traducciones", value: "translations" },
              { label: "Mensajes", value: "messages" },
              { label: "Usuarios", value: "users" },
            ].map(({ label, value }) => (
              <li key={value}>
                <Button
                  buttonLabel={label}
                  onButtonClick={() => setCurrentTab(value as typeof currentTab)}
                  buttonType="light"
                  className={`w-full text-left px-3 py-1.5 rounded text-sm ${
                    currentTab === value
                      ? "bg-gray-800 text-yellow-500"
                      : "bg-yellow-500 text-gray-800 hover:bg-gray-700 hover:text-gray-900"
                  }`}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <Button
            buttonLabel="Cerrar Sesión"
            onButtonClick={handleLogout}
            buttonType="light"
            className="w-full text-left px-3 py-1.5 rounded text-sm text-white bg-red-500 hover:bg-red-600"
          />
        </div>
      </aside>

      <main className="w-5/6 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Panel de Administración</h1>

        {currentTab === "appointments" && <AppointmentsForm />}
        {currentTab === "services" && <ServicesForm />}
        {currentTab === "testimonials" && <TestimonialForm />}
        {currentTab === "translations" && <AdminTranslationsPanel />}
        {currentTab === "messages" && <AdminMessagesPanel />}
        {currentTab === "users" && <UsersPanel />}
      </main>
    </div>
  );
}
