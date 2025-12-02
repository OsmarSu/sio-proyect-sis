'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, ReactElement } from "react";
// 1. Importamos tu icono local
import PriceTagIcon from "@/components/icons/PriceTagIcon";

type SubMenuItem = {
  title: string;
  href: string;
};

type MenuItem = {
  title: string;
  icon: ReactElement;
  href?: string;
  submenu?: SubMenuItem[];
};

const Sidebar = () => {
  const pathname = usePathname();
  // Estados para controlar la expansión de los submenús
  const [reportsExpanded, setReportsExpanded] = useState(pathname.startsWith('/dashboard/reportes'));
  const [productsExpanded, setProductsExpanded] = useState(pathname.startsWith('/dashboard/productos')); // NUEVO ESTADO
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ✅ ESTADO DINÁMICO: Controla qué menús están abiertos
  // Inicializamos basados en la URL actual para que al recargar siga abierto donde estabas
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Usuarios: pathname.startsWith('/dashboard/usuarios'),
    Productos: pathname.startsWith('/dashboard/productos'),
    Reportes: pathname.startsWith('/dashboard/reportes'),
  });

  // Colores de tu paleta
  const COLOR_PRIMARY = '#5556EE';
  const COLOR_SECONDARY = '#8150CE';
  const COLOR_ACCENT = '#2EB4D1';

  // Función para alternar menús
  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const menuItems = [
    {
      title: 'Inicio',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      href: '/dashboard',
    },
    {
      title: 'Usuarios',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      href: '/dashboard/usuarios',
      children: [
        { title: 'Gestión de Usuarios', href: '/dashboard/usuarios' },
      ],
    },

    {
      title: 'Productos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      href: '/dashboard/productos',
      children: [
        { title: 'Listado', href: '/dashboard/productos' },
        { title: 'Categorías', href: '/dashboard/productos/categorias' },
        { title: 'Marcas', href: '/dashboard/productos/marcas' },
      ],
    },
    {
      title: "Precios",
      // Quitamos el href directo para que no navegue, sino que abra el menú
      icon: <PriceTagIcon className="w-5 h-5" />,
      submenu: [
        { title: "Listado de Precios", href: "/dashboard/precios/listado" },
        { title: "Actualización Masiva", href: "/dashboard/precios/masiva" },
        { title: "Historial", href: "/dashboard/precios/historial" }, // Nombre corregido
      ],
    },
    {
      title: "Proveedores",
      href: "/dashboard/proveedores",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),

    },
    {
      title: 'Compras',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      href: '/dashboard/compras',
    },
    {
      title: 'Inventario',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      href: '/dashboard/inventario',
    },
    {
      title: 'Ventas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      href: '/dashboard/ventas',
    },
    {
      title: 'Reportes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: '/dashboard/reportes',
      children: [
        { title: 'General', href: '/dashboard/reportes/general' },
        { title: 'Ventas', href: '/dashboard/reportes/ventas' },
        { title: 'Productos', href: '/dashboard/reportes/productos' },
        { title: 'Inventario', href: '/dashboard/reportes/inventario' },
        { title: 'Clientes', href: '/dashboard/reportes/clientes' },
      ],
    },
  ];

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`${isCollapsed ? 'w-20' : 'w-64'
        } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col shadow-sm h-screen sticky top-0`}
    >
      {/* Logo y Toggle */}
      <div className="p-6 flex items-center justify-between border-b border-gray-200">
        {!isCollapsed ? (
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/LOGO OASIS.png"
              alt="Oasis Store Logo"
              className="h-10 w-10 rounded-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
            <div>
              <span className="text-gray-800 font-bold text-lg block">OASIS</span>
              <span className="text-xs text-gray-500">Panel Admin</span>
            </div>
          </Link>
        ) : (
          <Link href="/" className="mx-auto">
            <img
              src="/LOGO OASIS.png"
              alt="Oasis Store Logo"
              className="h-10 w-10 rounded-full object-cover transform hover:scale-110 transition-transform duration-300"
            />
          </Link>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
          title={isCollapsed ? 'Expandir' : 'Contraer'}
        >
          <svg
            className={`w-5 h-5 text-gray-600 group-hover:text-[${COLOR_PRIMARY}] transition-all ${isCollapsed ? 'rotate-180' : ''
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <React.Fragment key={item.href}>
            <div
              className={`relative ${item.children ? 'cursor-pointer' : ''
                }`}
            >
              <Link
                href={item.children ? '#' : item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive(item.href)
                    ? `bg-[${COLOR_PRIMARY}]/10 text-[${COLOR_PRIMARY}] shadow-sm`
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={item.children ? (e) => {
                    e.preventDefault(); 
                    toggleMenu(item.title);
                } : undefined}
              >
                {/* Indicador lateral para item activo */}
                {isActive(item.href) && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[${COLOR_PRIMARY}] to-[${COLOR_SECONDARY}] rounded-r-full`} />
                )}

                <span className={`flex-shrink-0 ${isActive(item.href)
                  ? `text-oasis-primary`
                  : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="font-medium text-sm flex-1">{item.title}</span>
                )}

                {/* Ícono de flecha para desplegar */}
                {!isCollapsed && item.children && (
                  <svg
                    className={`w-4 h-4 ml-auto text-gray-400 transition-transform duration-200 ${(item.href === '/dashboard/reportes' && reportsExpanded) ||
                      (item.href === '/dashboard/productos' && productsExpanded) // Condición para expandir el icono
                      ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}

                {/* Tooltip para modo colapsado */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.title}
                  </div>
                )}
              </Link>
            </div>

            {/* Sub-menú */}
            {!isCollapsed && item.children && expandedMenus[item.title] && (
              <div className="ml-6 border-l border-gray-200 pl-3 space-y-1 mt-1 animate-in slide-in-from-top-1 fade-in-20 duration-200">
                {item.children.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 group relative ${pathname === subItem.href
                      ? `bg-oasis-accent-light text-oasis-accent`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    {pathname === subItem.href && (
                      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-oasis-accent rounded-r-full`} />
                    )}
                    <span className={`text-sm ${pathname === subItem.href ? `text-oasis-accent` : 'text-gray-500 group-hover:text-gray-700'
                      }`}>
                      {subItem.title}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Separador */}
      <div className="px-4 py-2">
        <div className="border-t border-gray-200" />
      </div>

      {/* Sección de accesos rápidos */}
      {!isCollapsed && (
        <div className="p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
            Accesos Rápidos
          </p>
          <Link
            href="/cliente/catalogo"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors group"
          >
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <span className="text-sm">Ver como Cliente</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors group"
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm">Ir al Inicio</span>
          </Link>
        </div>
      )}
      {/* Footer de usuario */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50 mt-auto">
        <div
          className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""
            }`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white font-semibold text-sm">AD</span>
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-semibold text-sm truncate">Admin</p>
              <p className="text-gray-500 text-xs truncate">admin@oasis.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;