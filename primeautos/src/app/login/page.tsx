"use client";

import { useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "@/utils/auth"; 

interface JwtPayload {
  userId: string;
  email: string;
  role: "admin" | "usuario";
  exp: number;
}

const decodeJWT = (token: string): JwtPayload | null => {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (err) {
    console.error("Error al decodificar el JWT:", err);
    return null;
  }
};

const LoginPage = () => {
  const router = useRouter();
  const auth = useContext(AuthContext);

  // Hooks siempre deben declararse en el mismo orden y sin condiciones
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (!auth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Error de autenticación</h2>
          <p className="text-center text-sm text-red-500">No se pudo conectar con el sistema de autenticación.</p>
        </div>
      </div>
    );
  }

  const { login } = auth;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "/api/login",
        { email, password },
        { withCredentials: true }
      );

      if (!response.data.success) {
        setError("Credenciales incorrectas");
        setLoading(false);
        return;
      }

      const token = response.data.accessToken;

      if (!token) {
        setError("Error: no se recibió el token.");
        setLoading(false);
        return;
      }

      const decoded = decodeJWT(token);
      if (!decoded || !decoded.role) {
        setError("Error al decodificar el token.");
        setLoading(false);
        return;
      }

      login(response.data.accessToken);

      router.push(decoded.role === "admin" ? "/admin" : "/user");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Hubo un problema al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@gmail.com"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white font-bold rounded-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link href="/Register" className="underline text-blue-500">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
