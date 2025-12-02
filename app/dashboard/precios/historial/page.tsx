// app/dashboard/precios/historial/page.tsx
"use client";
export const dynamic = 'force-dynamic';
import React, { Suspense } from 'react';

function HistorialContent() {
  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Historial de Cambios</h2>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Aquí iría tu tabla de historial, pongo un ejemplo estático */}
        <div className="p-8 text-center text-gray-500">
          Funcionalidad de historial en desarrollo...
        </div>
      </div>
    </div>
  );
}

export default function HistorialPage() {
  return (
    <Suspense fallback={<div>Cargando historial...</div>}>
      <HistorialContent />
    </Suspense>
  );
}