import React, { useState, useEffect } from 'react';
import { PricedProduct } from '../types';

interface Props {
  product: PricedProduct | null;
  onClose: () => void;
  onSave: (id: string, prices: { minorPrice: number, majorPrice: number, floorPrice: number }) => void;
}

export const SingleEditModal = ({ product, onClose, onSave }: Props) => {
  const [prices, setPrices] = useState({ minorPrice: 0, majorPrice: 0, floorPrice: 0 });

  useEffect(() => {
    if (product) {
      setPrices({
        minorPrice: product.minorPrice,
        majorPrice: product.majorPrice,
        floorPrice: product.floorPrice
      });
    }
  }, [product]);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(product.id, prices);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">Editar Precios</h3>
          <button onClick={onClose} className="hover:bg-indigo-500 p-1 rounded">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
             <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
             <p className="text-sm text-gray-500">{product.code} - {product.category}</p>
          </div>

          <div className="space-y-4">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Precio Venta Público (PVP)</label>
               <div className="relative">
                 <span className="absolute left-3 top-2.5 text-gray-400 font-medium">Bs.</span>
                 <input 
                   type="number" step="0.50" 
                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-gray-900"
                   value={prices.minorPrice}
                   onChange={e => setPrices({...prices, minorPrice: parseFloat(e.target.value)})}
                 />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mayorista</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-medium">Bs.</span>
                    <input 
                      type="number" step="0.50"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={prices.majorPrice}
                      onChange={e => setPrices({...prices, majorPrice: parseFloat(e.target.value)})}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-red-500 uppercase mb-1">Mínimo (Floor)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-medium">Bs.</span>
                    <input 
                      type="number" step="0.50"
                      className="w-full pl-10 pr-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-red-50"
                      value={prices.floorPrice}
                      onChange={e => setPrices({...prices, floorPrice: parseFloat(e.target.value)})}
                    />
                  </div>
               </div>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};