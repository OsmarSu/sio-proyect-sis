// app/dashboard/precios/masiva/page.tsx
"use client";
export const dynamic = 'force-dynamic';
import React, { Suspense } from 'react';
import { usePrices } from '../hooks/usePrices';
import { MassUpdateTab } from '../components/MassUpdateTab';

function MasivaContent() {
  const { categories, applyMassUpdate } = usePrices();

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Actualización Masiva</h2>
      <MassUpdateTab categories={categories} onApply={applyMassUpdate} />
    </div>
  );
}

export default function MasivaPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <MasivaContent />
    </Suspense>
  );
}