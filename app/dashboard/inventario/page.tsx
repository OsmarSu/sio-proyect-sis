'use client';

import { useState } from 'react';
import Link from 'next/link';

const DashboardHomePage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado con icono grande */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Administrativo</h1>
              <p className="text-gray-600 text-base">
                Bienvenido al sistema de gestión de la Juguetería Oasis
              </p>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Venta
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas - Diseño limpio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Productos en Stock */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-green-600 text-sm font-semibold">↑ 12%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Productos en Stock</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">1,234</p>
          <p className="text-gray-500 text-xs">Total de productos</p>
        </div>

        {/* Ventas del Mes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-green-600 text-sm font-semibold">↑ 8%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Ventas del Mes</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">Bs. 45,678</p>
          <p className="text-gray-500 text-xs">Total de ventas</p>
        </div>

        {/* Clientes Activos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-green-600 text-sm font-semibold">↑ 5%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Clientes Activos</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">89</p>
          <p className="text-gray-500 text-xs">Clientes registrados</p>
        </div>

        {/* Proveedores */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-gray-600 text-sm font-semibold">0% vs mes anterior</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Proveedores</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">15</p>
          <p className="text-gray-500 text-xs">Proveedores activos</p>
        </div>
      </div>

      {/* Productos con Stock Bajo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Productos con Stock Bajo</h2>
              <p className="text-gray-600 text-sm">Productos que necesitan reabastecimiento urgente</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {/* Producto 1 */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Carro de Control Remoto</h3>
                  <p className="text-sm text-gray-600">Stock actual: 3 (Mínimo: 10)</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                Urgente
              </span>
            </div>

            {/* Producto 2 */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Muñeca Barbie</h3>
                  <p className="text-sm text-gray-600">Stock actual: 5 (Mínimo: 15)</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                Urgente
              </span>
            </div>

            {/* Producto 3 */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Lego City</h3>
                  <p className="text-sm text-gray-600">Stock actual: 2 (Mínimo: 8)</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                Urgente
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Accesos Rápidos</h2>
          <p className="text-gray-600 text-sm">Módulos principales del sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/inventario"
            className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-gray-200 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Inventario</span>
          </Link>

          <Link
            href="/dashboard/ventas"
            className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-xl hover:bg-green-50 hover:border-green-200 border border-gray-200 transition-all group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
              <svg className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-green-600 transition-colors">Ventas</span>
          </Link>

          <Link
            href="/dashboard/clientes"
            className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-xl hover:bg-purple-50 hover:border-purple-200 border border-gray-200 transition-all group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
              <svg className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">Clientes</span>
          </Link>

          <Link
            href="/dashboard/proveedores"
            className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-xl hover:bg-orange-50 hover:border-orange-200 border border-gray-200 transition-all group"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors">
              <svg className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">Proveedores</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;