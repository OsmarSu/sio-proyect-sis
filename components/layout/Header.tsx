'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Simulación de usuario - Reemplazar con tu sistema de auth real
const useAuth = () => {
  // TODO: Reemplazar con tu hook de autenticación real (NextAuth, Supabase, etc.)
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'staff' | 'customer' | null;
  } | null>({
    id: '1',
    name: 'Admin User',
    email: 'admin@oasis.com',
    role: 'admin', // Cambiar a 'customer' para probar vista de cliente
  });

  const logout = () => setUser(null);

  return { user, logout };
};

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Determinar si el usuario puede acceder al dashboard
  const canAccessDashboard = user?.role === 'admin' || user?.role === 'staff';

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/cliente/catalogo' },
    { name: 'Nosotros', href: '/#nosotros' },
    { name: 'Contacto', href: '/' }, // Manejado con onClick
  ];

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Si estamos en la home, hacer scroll al footer
    if (pathname === '/') {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Si estamos en otra página, ir a home y luego scroll
      window.location.href = '/#contacto';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/LOGO OASIS.png" 
              alt="Oasis Store Logo" 
              className="h-12 w-12 rounded-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-xl font-bold text-gray-800">Oasis Store</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Auth & Dashboard */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Dashboard Access (solo para admin/staff) */}
                {canAccessDashboard && (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Panel de Gestión
                  </Link>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        userMenuOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-xs text-blue-600 mt-1 capitalize">
                          Rol: {user.role === 'admin' ? 'Administrador' : user.role === 'staff' ? 'Personal' : 'Cliente'}
                        </p>
                      </div>
                      <Link
                        href="/perfil"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        href="/pedidos"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Mis Pedidos
                      </Link>
                      {canAccessDashboard && (
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Panel Administrativo
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">{user.name}</p>
                {canAccessDashboard && (
                  <Link
                    href="/dashboard"
                    className="block py-2 text-blue-600 font-medium"
                  >
                    Panel de Gestión
                  </Link>
                )}
                <Link href="/perfil" className="block py-2 text-gray-600">
                  Mi Perfil
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left py-2 text-red-600"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/login"
                  className="block py-2 text-center text-gray-700 font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="block py-2 text-center bg-blue-600 text-white rounded-lg font-semibold"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}