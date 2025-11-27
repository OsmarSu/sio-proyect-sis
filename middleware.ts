import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. ZONA DE SEGURIDAD:
  // Permitimos pasar SIEMPRE a las rutas de autenticación y archivos estáticos.
  // Si bloqueamos esto, rompemos el login (bucle infinito).
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // 2. Obtener el token
  // IMPORTANTE: Asegúrate de que NEXTAUTH_SECRET en .env sea el mismo
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 3. PROTECCIÓN DEL DASHBOARD (El Muro)
  // Si la ruta empieza con /dashboard y NO hay token -> Fuera.
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      // Usuario no autorizado intentando entrar al panel
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname); // Para regresar después de loguear
      return NextResponse.redirect(url);
    }
  }

  // 4. PROTECCIÓN DEL LOGIN (UX)
  // Si el usuario YA tiene token y quiere ir al login -> Lo mandamos al dashboard.
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Si no cae en ningún caso anterior, dejamos pasar.
  return NextResponse.next();
}

export const config = {
  // El Matcher optimiza Next.js para que no ejecute el middleware en todo
  matcher: [
    "/dashboard/:path*", // Proteger todo lo que esté bajo dashboard
    "/login",            // Interceptar login
    "/register",         // Interceptar registro
    "/cliente/:path*"    // Proteger área de clientes
  ],
};