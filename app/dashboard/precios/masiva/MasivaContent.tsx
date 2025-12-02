'use client';

import React from 'react';
import { usePrices } from '../hooks/usePrices';
import { MassUpdateTab } from '../components/MassUpdateTab';
import { PricedProduct } from '../types';

interface MasivaContentProps {
    initialProducts: PricedProduct[];
}

export function MasivaContent({ initialProducts }: MasivaContentProps) {
    const { categories, applyMassUpdate } = usePrices(initialProducts);

    return (
        <div className="animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Actualización Masiva</h2>
            <MassUpdateTab categories={categories} onApply={applyMassUpdate} />
        </div>
    );
}
