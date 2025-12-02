import React, { useState } from 'react';
import { MassUpdateConfig } from '../types';

interface Props {
  categories: string[];
  onApply: (config: MassUpdateConfig) => void;
}

export const MassUpdateTab = ({ categories, onApply }: Props) => {
  const [config, setConfig] = useState<MassUpdateConfig>({
    category: 'Todas',
    field: 'minorPrice',
    type: 'percentage',
    value: 0
  });

  const handleSubmit = () => {
    if (confirm('¿Estás seguro de aplicar estos cambios masivos? Esta acción afectará múltiples productos.')) {
      onApply(config);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Centro de Actualización Masiva</h2>
        <p className="text-gray-500 text-sm mt-1">Aplica aumentos o descuentos por categoría y tipo de precio.</p>
      </div>

      <div className="space-y-8">
        {/* Selector de Categoría */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">1. Seleccionar Grupo de Productos</label>
          <select 
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={config.category}
            onChange={e => setConfig({...config, category: e.target.value})}
          >
            <option value="Todas">Todo el Inventario (Todas las categorías)</option>
            {categories.map(c => <option key={c} value={c}>Categoría: {c}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Selector de Precio Objetivo */}
           <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">2. Precio a Modificar</label>
              <div className="space-y-2">
                {[
                  { id: 'minorPrice', label: 'Precio Venta (PVP)' },
                  { id: 'majorPrice', label: 'Precio Mayorista' },
                  { id: 'floorPrice', label: 'Precio Piso (Mínimo)' }
                ].map((opt) => (
                  <label key={opt.id} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${config.field === opt.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input 
                      type="radio" 
                      name="field" 
                      value={opt.id}
                      checked={config.field === opt.id}
                      onChange={() => setConfig({...config, field: opt.id as any})} 
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
           </div>

           {/* Configuración de Valor */}
           <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">3. Configurar Ajuste</label>
              
              <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                <button onClick={() => setConfig({...config, type: 'percentage'})}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${config.type === 'percentage' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  Porcentaje %
                </button>
                <button onClick={() => setConfig({...config, type: 'fixed'})}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${config.type === 'fixed' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  Monto Fijo (Bs)
                </button>
              </div>

              <div className="relative">
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full p-3 pl-4 pr-12 border border-gray-300 rounded-lg text-lg font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="0.00"
                  value={config.value}
                  onChange={e => setConfig({...config, value: parseFloat(e.target.value)})}
                />
                <span className="absolute right-4 top-4 text-gray-400 font-medium">
                  {config.type === 'percentage' ? '%' : 'Bs'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tip: Usa valores negativos (ej. -10) para aplicar descuentos.
              </p>
           </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 mt-4 flex justify-center items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          Ejecutar Actualización
        </button>
      </div>
    </div>
  );
};