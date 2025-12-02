import React from 'react';
import { PricedProduct } from '../types';

interface Props {
  products: PricedProduct[];
  onEdit: (product: PricedProduct) => void;
}

export const PriceListTab = ({ products, onEdit }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(p => (
        <div key={p.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{p.category}</span>
            <button onClick={() => onEdit(p)} className="text-gray-400 hover:text-blue-600 transition-colors">
              {/* Icono Edit */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
          </div>
          
          <h3 className="font-bold text-gray-800 truncate mb-1" title={p.name}>{p.name}</h3>
          <p className="text-xs text-gray-500 mb-4 font-mono">{p.code}</p>
          
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">PVP (Base)</span>
              <span className="text-lg font-bold text-gray-900">Bs. {p.minorPrice.toFixed(2)}</span>
            </div>
            <div className="w-full h-px bg-gray-200"></div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Mayorista:</span>
              <span className="font-medium text-gray-700">Bs. {p.majorPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Mínimo:</span>
              <span className="font-medium text-red-600">Bs. {p.floorPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};