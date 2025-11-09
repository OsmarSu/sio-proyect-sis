// components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react'; // Necesitamos useEffect para el contexto
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // 1. IMPORTAMOS EL HOOK DE AUTENTICACIÓN

export default function Header() {
  const pathname = usePathname();
  // 2. Usamos el useAuth real que ya configuramos
  const { user, logout, loading } = useAuth(); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Determinar si el usuario puede acceder al dashboard (ahora basado en tu rol 'PERSONAL')
  const canAccessDashboard = user?.role === 'PERSONAL'; // <-- CAMBIO AQUÍ: 'admin' o 'staff' a 'PERSONAL'

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/cliente/catalogo' },
    { name: 'Nosotros', href: '/#nosotros' },
    { name: 'Contacto', href: '/' }, 
  ];

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === '/') {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.location.href = '/#contacto';
    }
  };

  // Función para obtener el rol para mostrarlo en el frontend
  const getUserDisplayRole = () => {
    if (!user) return "Invitado";
    if (user.role === 'PERSONAL') return "Administrador";
    if (user.role === 'CLIENTE') return "Cliente";
    return user.role; // En caso de roles futuros
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Usamos el componente Image de Next.js y tu logo */}
            <Image 
              src="/logo.png" // Asumiendo que tu logo.png está en la raíz de 'public'
              alt="Oasis Store Logo" 
              width={48} // Ajusta el tamaño según tu logo
              height={48} // Ajusta el tamaño según tu logo
              className="rounded-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              priority 
            />
            <span className="text-xl font-bold text-gray-800">Oasis Store</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => {
              if (item.name === 'Contacto') {
                return (
                  <a
                    key={item.name}
                    href="#contacto"
                    onClick={handleContactClick}
                    className="text-sm font-medium transition-colors duration-200 cursor-pointer text-gray-600 hover:text-blue-600"
                  >
                    {item.name}
                  </a>
                );
              }
              return (
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
              );
            })}
          </div>

          {/* Right Side - Auth & Dashboard */}
          <div className="hidden md:flex items-center gap-4">
            {/* 3. Lógica condicional basada en el estado de autenticación */}
            {loading ? ( // Mostrar cargando mientras se verifica la sesión
              <div className="text-gray-600">Cargando...</div>
            ) : user ? ( // Si hay un usuario logueado
              <>
                {/* Botón para Panel de Gestión (solo para PERSONAL) */}
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
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name || user.email}</span>
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
                        <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-xs text-blue-600 mt-1 capitalize">
                          Rol: {getUserDisplayRole()} {/* <-- CAMBIO AQUÍ */}
                        </p>
                      </div>
                      <Link href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setUserMenuOpen(false)}>Mi Perfil</Link>
                      <Link href="/pedidos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setUserMenuOpen(false)}>Mis Pedidos</Link>
                      {canAccessDashboard && (
                        <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setUserMenuOpen(false)}>Panel Administrativo</Link>
                      )}
                      <hr className="my-1" />
                      <button 
                        onClick={() => { logout(); setUserMenuOpen(false); }} // Cerrar dropdown al hacer logout
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : ( // Si no hay usuario logueado
              <>
                <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
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
            {navigation.map((item) => {
              if (item.name === 'Contacto') {
                return (
                  <a
                    key={item.name}
                    href="#contacto"
                    onClick={(e) => {
                      handleContactClick(e);
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {item.name}
                  </a>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            
            {user ? (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">{user.name || user.email}</p>
                <p className="text-xs text-gray-500 mb-2">Rol: {getUserDisplayRole()}</p> {/* <-- CAMBIO AQUÍ */}
                {canAccessDashboard && (
                  <Link href="/dashboard" className="block py-2 text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Panel de Gestión
                  </Link>
                )}
                <Link href="/perfil" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                  Mi Perfil
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-red-600">
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <Link href="/login" className="block py-2 text-center text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Iniciar Sesión</Link>
                <Link href="/register" className="block py-2 text-center bg-blue-600 text-white rounded-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>Registrarse</Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}