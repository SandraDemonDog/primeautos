"use client";

import { useState } from "react";
import axios from "axios";

interface User {
  id?: string;
  name: string;
  email: string;
  role: "admin" | "usuario";
  password?: string;
}

interface Props {
  user?: User;
  onSuccess: () => void;
}

export default function UserForm({ user, onSuccess }: Props) {
  const [formData, setFormData] = useState<User>({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "usuario",
    password: "",
  });

  const [error, setError] = useState("");

  const isEditing = !!user;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isEditing) {

        const payload: Partial<User> = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };


        if (formData.password && formData.password.length >= 6) {
          payload.password = formData.password;
        } else if (formData.password && formData.password.length > 0 && formData.password.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres.");
          return;
        }

        await axios.patch(`/api/users/${user!.id}`, payload);
      } else {

        if (!formData.password || formData.password.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres.");
          return;
        }

        await axios.post("/api/users", {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
        });
      }

      onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.error || "Error al guardar el usuario.";
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow bg-white mb-6">
      <h3 className="text-lg font-semibold">{isEditing ? "Editar Usuario" : "Crear Usuario"}</h3>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Correo</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Rol</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mt-1"
        >
          <option value="usuario">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">
          {isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
        </label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required={!isEditing}
          className="w-full border px-3 py-2 rounded mt-1"
          minLength={isEditing ? undefined : 6}
          placeholder={isEditing ? "Dejar vacío para no cambiar" : undefined}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isEditing ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}
