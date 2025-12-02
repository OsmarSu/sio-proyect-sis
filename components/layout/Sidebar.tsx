"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, ReactElement } from "react";
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      title: "Inicio",
      href: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      title: "Productos",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      submenu: [
        { title: "Catálogo", href: "/dashboard/productos" },
        { title: "Categorías", href: "/dashboard/productos/categorias" },
        { title: "Marcas", href: "/dashboard/productos/marcas" },
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: "Inventario",
      href: "/dashboard/inventario",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "Ventas",
      href: "/dashboard/ventas",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: "Reportes",
      href: "/dashboard/reportes",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  const isActive = (item: MenuItem) => {
    if (item.href) {
      return item.href === "/dashboard"
        ? pathname === item.href
        : pathname.startsWith(item.href);
    }
    if (item.submenu) {
      return item.submenu.some((sub) => pathname.startsWith(sub.href));
    }
    return false;
  };

  const handleSubmenuClick = (title: string) => {
    if (isCollapsed) setIsCollapsed(false);
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col shadow-sm h-screen sticky top-0`}
    >
      <div className="p-6 flex items-center justify-between border-b border-gray-200">
        {!isCollapsed ? (
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/LOGO OASIS.png"
              alt="Oasis"
              className="h-10 w-10 rounded-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
            <div>
              <span className="text-gray-800 font-bold text-lg block">
                OASIS
              </span>
              <span className="text-xs text-gray-500">Panel Admin</span>
            </div>
          </Link>
        ) : (
          <Link href="/" className="mx-auto">
            <img
              src="/LOGO OASIS.png"
              alt="Oasis"
              className="h-10 w-10 rounded-full object-cover transform hover:scale-110 transition-transform duration-300"
            />
          </Link>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
        >
          <svg
            className={`w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-all ${
              isCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item);
          const isMenuOpen = openSubmenu === item.title;

          if (item.submenu) {
            return (
              <div key={item.title} className="space-y-1">
                <button
                  onClick={() => handleSubmenuClick(item.title)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } ${isCollapsed ? "justify-center" : ""}`}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full" />
                  )}
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="font-medium text-sm flex-1 text-left">
                        {item.title}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isMenuOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  )}
                </button>

                {!isCollapsed && isMenuOpen && (
                  <div className="pl-11 pr-2 space-y-1 transition-all animate-in slide-in-from-top-2 duration-200">
                    {item.submenu.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                            isSubActive
                              ? "text-blue-600 bg-blue-50/50 font-medium"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {subItem.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                active
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full" />
              )}
              <span
                className={`flex-shrink-0 ${
                  active
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.title}</span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-sm">Ir al Inicio</span>
          </Link>
        </div>
      )}
      {/* Footer de usuario */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50 mt-auto">
        <div
          className={`flex items-center gap-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white font-semibold text-sm">AD</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-semibold text-sm truncate">
                Admin
              </p>
              <p className="text-gray-500 text-xs truncate">admin@oasis.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;