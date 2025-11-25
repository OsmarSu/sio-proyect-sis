// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'tu-super-secreto-cambialo-en-produccion-12345'
);

// Rutas públicas (no requieren autenticación)
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/cliente/catalogo',
];
// si quiren entrar solo agregar '/dashboard', <----
// Rutas de API públicas
const PUBLIC_API_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si es una ruta pública
  const isPublicPath = PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'));
  const isPublicApiPath = PUBLIC_API_PATHS.some(path => pathname.startsWith(path));

  if (isPublicPath || isPublicApiPath) {
    return NextResponse.next();
  }

  // Obtener token de las cookies
  const token = request.cookies.get('auth-token')?.value;

  // Si no hay token, redirigir a login
  if (!token) {
    console.log(`[Middleware] No token found, redirecting from ${pathname} to /login`);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  try {
    // Verificar token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;
    const userId = payload.id as string;

    console.log(`[Middleware] User ${userId} (${userRole}) accessing ${pathname}`);

    // Proteger rutas del dashboard (solo PERSONAL)
    if (pathname.startsWith('/dashboard')) {
      if (userRole !== 'PERSONAL') {
        console.log(`[Middleware] User ${userId} denied access to dashboard (role: ${userRole})`);
        const url = request.nextUrl.clone();
        url.pathname = '/cliente/catalogo';
        return NextResponse.redirect(url);
      }
    }

    // Proteger rutas de cliente (solo CLIENTE y PERSONAL)
    if (pathname.startsWith('/cliente') && !pathname.startsWith('/cliente/catalogo')) {
      if (userRole !== 'CLIENTE' && userRole !== 'PERSONAL') {
        console.log(`[Middleware] User ${userId} denied access to client area`);
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }

    // Añadir headers con información del usuario
    const response = NextResponse.next();
    response.headers.set('x-user-id', userId);
    response.headers.set('x-user-role', userRole);
    return response;
  } catch (error) {
    // Token inválido, redirigir a login
    console.error(`[Middleware] Invalid token for ${pathname}:`, error);
    
    // Eliminar cookie inválida
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    response.searchParams.set('redirect', pathname);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};