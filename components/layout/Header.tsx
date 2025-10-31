'use client';

import { useState } from 'react';
import { Navigation } from './Navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Items de navegación para el componente Navigation
  const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Catálogo', href: '/cliente/catalogo' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#contacto' }
  ];

  return (
    <>
      {/* Navigation para desktop */}
      <div className="hidden md:block">
        <Navigation 
          navItems={navItems}
          className="fixed w-full top-0 z-50"
        />
      </div>

      {/* Header móvil personalizado */}
      <header className="md:hidden bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Juguetería</span>
              <span className="text-2xl font-bold text-gray-800">SIO</span>
            </div>

            {/* Menú Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>

          {/* Menú Mobile Expandido */}
          {isMenuOpen && (
            <div className="py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                  Inicio
                </a>
                <a href="/cliente/catalogo" className="text-gray-700 hover:text-blue-600 font-medium">
                  Catálogo
                </a>
                <a href="#nosotros" className="text-gray-700 hover:text-blue-600 font-medium">
                  Nosotros
                </a>
                <a href="#contacto" className="text-gray-700 hover:text-blue-600 font-medium">
                  Contacto
                </a>
                
                <div className="pt-4 flex flex-col space-y-2">
                  <a 
                    href="/cliente/catalogo"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 text-center"
                  >
                    Ver Catálogo
                  </a>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}