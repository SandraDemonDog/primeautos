
"use client";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export interface IUser {
  userId: string;
  email: string;
  role: "admin" | "usuario";
}

interface IAuthContext {
  accessToken: string | null;
  user: IUser | null;
  loading: boolean;
  getAccessToken: () => Promise<string | null>;
  login: (accessToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const decodeJwt = (token: string): IUser | null => {
  if (!token || typeof token !== "string") {
    console.warn("⚠️ Token no válido o undefined.");
    return null;
  }

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);

    console.log("✅ Payload decodificado:", payload);
    return payload.userId && payload.email && payload.role ? payload : null;
  } catch (err) {
    console.error("❌ Error al decodificar el token:", err);
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      console.log("🔄 Intentando refrescar el token...");
      const response = await fetch("/api/refreshToken", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      console.log("📦 Respuesta de refreshToken:", data);

      if (data.success && data.accessToken) {
        const decoded = decodeJwt(data.accessToken);

        if (!decoded) {
          throw new Error("❌ Error al decodificar el accessToken recibido.");
        }

        setAccessToken(data.accessToken);
        setUser(decoded);
        return data.accessToken;
      } else {
        console.warn("⚠️ No se pudo refrescar el token o el token es inválido.");
        logout();
        return null;
      }
    } catch (error) {
      console.error("❌ Error al refrescar el token:", error);
      logout();
      return null;
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!accessToken) {
      console.log("🔍 No hay token en memoria, refrescando...");
      return await refreshAccessToken();
    }
    return accessToken;
  };

  const login = (token: string): void => {
    console.log("🔐 Inicio de sesión con token:", token);
    const decoded = decodeJwt(token);
    if (!decoded) {
      console.error("❌ Token inválido durante login.");
      return;
    }
    setAccessToken(token);
    setUser(decoded);
  };

  const logout = (): void => {
    console.log("🚪 Cerrando sesión...");
    setAccessToken(null);
    setUser(null);
  };

  useEffect(() => {
    refreshAccessToken().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        getAccessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



  