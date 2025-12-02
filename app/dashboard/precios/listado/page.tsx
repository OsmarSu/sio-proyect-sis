// app/dashboard/precios/listado/page.tsx
"use client";
import React, { useState } from 'react';
// Nota los dos puntos ../../ para salir de la carpeta listado y buscar en precios
import { usePrices } from '../hooks/usePrices';
import { PriceListTab } from '../components/PriceListTab';
import { SingleEditModal } from '../components/SingleEditModal';
import { PricedProduct } from '../types';

export default function ListadoPage() {
  const { products, categories, filters, setFilters, updateSinglePrice } = usePrices();
  const [editingProduct, setEditingProduct] = useState<PricedProduct | null>(null);

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Listado General de Precios</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
           <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-300 outline-none"
            value={filters.search}
            onChange={e => setFilters({...filters, search: e.target.value})}
          />
        </div>
        <select 
          className="w-full md:w-64 py-2.5 px-4 rounded-lg border border-slate-300 bg-white outline-none"
          value={filters.category}
          onChange={e => setFilters({...filters, category: e.target.value})}
        >
          <option value="">Todas las Categorías</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <PriceListTab products={products} onEdit={setEditingProduct} />

      <SingleEditModal 
        product={editingProduct} 
        onClose={() => setEditingProduct(null)} 
        onSave={updateSinglePrice}
      />
    </div>
  );
}