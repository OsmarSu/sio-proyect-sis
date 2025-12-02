// app/dashboard/precios/layout.tsx
import React from 'react';

export default function PreciosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen bg-slate-50">
      {/* Título y Encabezado Fijo */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 text-white">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Gestión de Precios</h1>
          <p className="text-slate-500 font-medium">Control de tarifas, márgenes y políticas de venta.</p>
        </div>
      </div>

      {/* Aquí se cargará Listado, Masiva o Historial según lo que elijas en el menú */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] p-8">
        {children}
      </div>
    </div>
  );
}