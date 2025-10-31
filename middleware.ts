// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  (req) => {
    const role = req.nextauth.token?.role;
    
    // Solo verificar permisos para rutas de admin
    if (req.nextUrl.pathname.startsWith('/admin') && role !== 'EMPLEADO' && role !== 'ADMIN') {
      return new Response('Acceso denegado', { status: 403 });
    }
  },
  { 
    callbacks: { 
      authorized: ({ token, req }) => {
        // Solo requerir autenticación para rutas de admin
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token;
        }
        // Todas las demás rutas (incluyendo /cliente/) son públicas
        return true;
      }
    } 
  }
);

export const config = { matcher: ['/admin/:path*'] }; // Solo aplicar a rutas de admin