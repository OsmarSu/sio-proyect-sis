// components/layout/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isDarkPage = ['/login', '/register'].includes(pathname);
  const canAccessDashboard = user?.role === 'PERSONAL';

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/cliente/catalogo' },
    { name: 'Nosotros', href: '/#nosotros' },
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

  const getUserDisplayRole = () => {
    if (!user) return "Invitado";
    if (user.role === 'PERSONAL') return "Administrador";
    if (user.role === 'CLIENTE') return "Cliente";
    return user.role;
  };

  const navLinkClass = (isActive: boolean) => {
    let classes = 'text-sm transition-all duration-300 transform hover:-translate-y-0.5';
    if (isActive) {
      classes += isDarkPage 
        ? ' font-semibold text-blue-400'
        : ' font-semibold text-blue-600';
    } else {
      classes += isDarkPage
        ? ' font-medium text-gray-300 hover:text-blue-400'
        : ' font-medium text-gray-600 hover:text-blue-600';
    }
    return classes;
  };

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300
      ${isDarkPage
        ? 'bg-neutral-950/80 border-b border-neutral-800'
        : 'bg-white/80 border-b border-gray-200'
      }
    `}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/LOGO OASIS.png" // <-- Tu cambio de logo
              alt="Oasis Store Logo" 
              width={48}
              height={48}
              className="rounded-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              priority 
            />
            <span className={`
              text-xl font-bold transition-colors duration-300
              ${isDarkPage ? 'text-white' : 'text-gray-800'}
            `}>
              Oasis Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={navLinkClass(pathname === item.href)}
              >
                {item.name}
              </Link>
            ))}
            <a
              key="Contacto"
              href="#contacto"
              onClick={handleContactClick}
              className={navLinkClass(false) + ' cursor-pointer'}
            >
              Contacto
            </a>
          </div>

          {/* Right Side - Auth & Dashboard */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className={isDarkPage ? 'text-gray-300' : 'text-gray-600'}>Cargando...</div>
            ) : user ? (
              <>
                {/* ... (código de usuario logueado no cambia) ... */}
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
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isDarkPage ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${isDarkPage ? 'text-gray-200' : 'text-gray-700'}`}>
                      {user.name || user.email}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isDarkPage ? 'text-gray-400' : 'text-gray-400'} ${
                        userMenuOpen ? 'rotate-180' : ''
                      }`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {userMenuOpen && (
                    <div className={`
                      absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-2
                      ${isDarkPage
                        ? 'bg-neutral-900 border border-neutral-700'
                        : 'bg-white border border-gray-200'
                      }
                    `}>
                      <div className={`px-4 py-2 ${isDarkPage ? 'border-b border-neutral-700' : 'border-b border-gray-200'}`}>
                        <p className={`text-sm font-medium ${isDarkPage ? 'text-white' : 'text-gray-900'}`}>{user.name || user.email}</p>
                        <p className={`text-xs ${isDarkPage ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                        <p className="text-xs text-blue-500 mt-1 capitalize">
                          Rol: {getUserDisplayRole()}
                        </p>
                      </div>
                      <Link href="/perfil" className={navLinkClass(false) + ' block w-full text-left px-4 py-2'} onClick={() => setUserMenuOpen(false)}>Mi Perfil</Link>
                      <Link href="/pedidos" className={navLinkClass(false) + ' block w-full text-left px-4 py-2'} onClick={() => setUserMenuOpen(false)}>Mis Pedidos</Link>
                      {canAccessDashboard && (
                        <Link href="/dashboard" className={navLinkClass(false) + ' block w-full text-left px-4 py-2'} onClick={() => setUserMenuOpen(false)}>Panel Administrativo</Link>
                      )}
                      <hr className={isDarkPage ? 'my-1 border-neutral-700' : 'my-1'} />
                      <button 
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                          isDarkPage 
                            ? 'text-red-500 hover:bg-red-900/50' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* <-- MEJORA: Lógica para ocultar el botón si ya estamos en /login */}
                {pathname !== '/login' && (
                  <Link 
                    href="/login" 
                    className={`
                      px-4 py-2 font-medium transition-all duration-300 transform rounded-lg whitespace-nowrap
                      hover:-translate-y-0.5
                      ${isDarkPage
                        ? 'text-gray-300 hover:text-blue-400 hover:bg-neutral-800' // <-- MEJORA: Añadido hover:bg
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100' // <-- MEJORA: Añadido hover:bg
                      }
                    `}
                  >
                    Iniciar Sesión
                  </Link>
                )}
                
                {/* Comentado por que no sabemso si lo usaremos */}
                {/* {pathname !== '/register' && (
                  <Link 
                    href="/register" 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40 whitespace-nowrap"
                  >
                    Registrarse
                  </Link>
                )} */}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              isDarkPage ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
            }`}
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
          <div className={`
            md:hidden py-4 ${isDarkPage 
              ? 'bg-neutral-950 border-t border-neutral-800' 
              : 'border-t border-gray-200'
            }
          `}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={navLinkClass(pathname === item.href) + ' block !py-2 px-3 rounded-md mx-2'}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
             <a
              key="Contacto"
              href="#contacto"
              onClick={(e) => {
                handleContactClick(e);
                setMobileMenuOpen(false);
              }}
              className={navLinkClass(false) + ' block !py-2 px-3 rounded-md mx-2 cursor-pointer'}
            >
              Contacto
            </a>
            
            {user ? (
              // ... (código de usuario logueado en móvil no cambia) ...
              <div className={`mt-4 pt-4 ${isDarkPage ? 'border-t border-neutral-800' : 'border-t border-gray-200'}`}>
                <p className={`text-sm font-medium mb-2 px-3 ${isDarkPage ? 'text-white' : 'text-gray-900'}`}>{user.name || user.email}</p>
                <p className={`text-xs mb-2 px-3 ${isDarkPage ? 'text-gray-400' : 'text-gray-500'}`}>Rol: {getUserDisplayRole()}</p>
                {canAccessDashboard && (
                  <Link href="/dashboard" className={navLinkClass(false) + ' block !py-2 px-3 rounded-md mx-2 !text-blue-500'} onClick={() => setMobileMenuOpen(false)}>
                    Panel de Gestión
                  </Link>
                )}
                <Link href="/perfil" className={navLinkClass(false) + ' block !py-2 px-3 rounded-md mx-2'} onClick={() => setMobileMenuOpen(false)}>
                  Mi Perfil
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className={`block w-full text-left px-3 py-2 mx-2 rounded-md ${isDarkPage ? 'text-red-500 hover:bg-red-900/50' : 'text-red-600 hover:bg-red-50'}`}>
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className={`mt-4 pt-4 space-y-2 ${isDarkPage ? 'border-t border-neutral-800' : 'border-t border-gray-200'}`}>
                
                {/* <-- MEJORA: Lógica para ocultar el botón si ya estamos en /login */}
                {pathname !== '/login' && (
                  <Link href="/login" className={navLinkClass(false) + ' block text-center !py-2 px-3 rounded-md mx-2'} onClick={() => setMobileMenuOpen(false)}>Iniciar Sesión</Link>
                )}
                
                {/* <-- MEJORA: Comentado para ser consistente con el escritorio */}
                {/* {pathname !== '/register' && (
                  <Link href="/register" className="block mx-3 py-2 text-center bg-blue-600 text-white rounded-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>Registrarse</Link>
                )} */}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}