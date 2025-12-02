'use client';

import React, { useState } from 'react';
import { usePrices } from '../hooks/usePrices';
import { PriceListTab } from '../components/PriceListTab';
import { SingleEditModal } from '../components/SingleEditModal';
import { PricedProduct } from '../types';

interface ListadoContentProps {
    initialProducts: PricedProduct[];
}

export function ListadoContent({ initialProducts }: ListadoContentProps) {
    const {
        products,
        categories,
        filters,
        setFilters,
        updateSinglePrice
    } = usePrices(initialProducts);

    const [editingProduct, setEditingProduct] = useState<PricedProduct | null>(null);

    const handleSaveSingle = (id: string, prices: { minorPrice: number, majorPrice: number, floorPrice: number }) => {
        updateSinglePrice(id, prices);
        setEditingProduct(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o código..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={filters.search}
                        onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                </div>
                <select
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={filters.category}
                    onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                    <option value="Todas">Todas las Categorías</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Lista de Cards */}
            <PriceListTab
                products={products}
                onEdit={setEditingProduct}
            />

            {/* Modal de Edición Individual */}
            {editingProduct && (
                <SingleEditModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSave={handleSaveSingle}
                />
            )}
        </div>
    );
}
