"use client";

import { useState, useEffect } from "react";
import ServicesForm from "./servicesForm";
import TestimonialForm from "./testimonialsForm";
import AppointmentsForm from "./appointmentsForm";
import AdminTranslationsPanel from "./adminTranslationPanel";
import AdminMessagesPanel from "./adminMessages";
import UsersPanel from "./userPanel";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPage() {
  const [currentTab, setCurrentTab] = useState<
    "appointments" | "services" | "testimonials" | "messages" | "translations" | "users"
  >("appointments");

  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="text-center py-8 text-gray-700">
        Verificando acceso de administrador...
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto bg-white transition-all h-screen">
      {/* Panel lateral */}
      <aside className="w-1/6 bg-gray-200 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-base font-semibold mb-2">Admin</h2>
          <p className="text-xs text-gray-700 mb-4 break-words">{user.email}</p>

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

      {/* Panel principal */}
      <main className="flex-1 p-6 overflow-y-auto">
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
