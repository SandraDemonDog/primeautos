// middleware.ts
/*import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log('Middleware invoked for path:', pathname);

  // ──────────────── Rutas de Administrador ───────────────
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/appointments')) {
    // Se espera el token en la cookie "refreshToken"
    const token = req.cookies.get('refreshToken')?.value;
    console.log('Admin route: token from cookie:', token);

    if (!token) {
      console.error("No se encontró token para admin, redirigiendo a /login");
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET no definido");
      const payload = jwt.verify(token, secret);
      console.log("Admin route: payload:", payload);

      // Validar que el token corresponde a un administrador
      if (typeof payload === 'object' && payload.role !== "admin") {
        console.error("Acceso denegado. No es administrador.");
        return NextResponse.redirect(new URL('/login', req.url));
      }

      // Inyectar el header "x-user-email"
      const requestHeaders = new Headers(req.headers);
      if (typeof payload === "object" && payload.email) {
        requestHeaders.set("x-user-email", payload.email as string);
      }
      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch (error) {
      console.error("Error en middleware admin:", error);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // ──────────────── Rutas de Usuario (appointmentsUser) ───────────────
  if (pathname.startsWith('/api/appointmentsUser')) {
    // Usamos únicamente la cookie "refreshToken"
    const token = req.cookies.get('refreshToken')?.value;
    console.log("User route: token obtained from cookie:", token);

    if (!token) {
      console.error("User route: token no encontrado, redirigiendo a /login");
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET no definido");
      const payload = jwt.verify(token, secret);
      console.log("User route: payload:", payload);

      // Inyectar el header "x-user-email"
      const requestHeaders = new Headers(req.headers);
      if (typeof payload === "object" && payload.email) {
        requestHeaders.set("x-user-email", payload.email as string);
      }
      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch (error) {
      console.error("User route: Error al verificar token:", error);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // ──────────────── Otras rutas ───────────────
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',            // Rutas de administrador
    '/api/appointments/:path*', // Endpoints de admin
    '/api/appointmentsUser/:path*' // Endpoints para usuarios
  ],
};*/
// middleware.ts
/*import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; // Importa cookies() de next/headers

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log('Middleware invoked for path:', pathname);

  // Obtener el token desde las cookies de manera asíncrona
  const cookieStore = await cookies(); // Usa 'await'
  const token = cookieStore.get('refreshToken'); // Ahora obtenemos el token correctamente

  console.log('Token desde cookie:', token);

  if (!token) {
    // Si no hay token, redirigir a login
    if (pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Token no proporcionado" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    console.log('Payload del token:', payload);

    // Dependiendo de la ruta, verificar el rol (admin o usuario)
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/appointments")) {
      if (payload.role !== "admin") {
        console.error("Acceso denegado, no es administrador.");
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    if (pathname.startsWith("/api/appointmentsUser")) {
      if (payload.role !== "usuario") {
        console.error("Acceso denegado, no es un usuario.");
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // Si el token es válido, continua con la solicitud
    return NextResponse.next();

  } catch (error) {
    console.error("Error al verificar token:", error);
    if (pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Token inválido" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    '/admin/:path*',              // Rutas de administración
    '/api/appointments/:path*',    // Endpoints de administración
    '/api/appointmentsUser/:path*',// Endpoints de usuarios
  ],
};*/

