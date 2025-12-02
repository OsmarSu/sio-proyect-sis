// app/dashboard/reportes/inventario/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, AlertCircle } from 'lucide-react';

// Colores de tu paleta (referencia)
const PRIMARY_COLOR = '#5556EE';
const DANGER_COLOR = '#DE6415';
const ACCENT_COLOR = '#2EB4D1';
export const dynamic = 'force-dynamic';

function InventarioReportContent() {
  const searchParams = useSearchParams();
  const dateRange = searchParams.get('range') || 'month';

  // Datos dummy de inventario
  const stockPorCategoria = [
    { categoria: 'Construcción', totalStock: 800, valorTotal: 120000 },
    { categoria: 'Muñecas', totalStock: 450, valorTotal: 75000 },
    { categoria: 'Deportes', totalStock: 600, valorTotal: 50000 },
    { categoria: 'Juegos de Mesa', totalStock: 300, valorTotal: 40000 },
    { categoria: 'Electrónicos', totalStock: 200, valorTotal: 90000 },
  ];

  const productosBajoStock = [
    { nombre: 'Set de Bloques Pequeños', stock: 5, minStock: 10 },
    { nombre: 'Muñeca Articulada', stock: 3, minStock: 8 },
    { nombre: 'Balón de Fútbol N°5', stock: 7, minStock: 12 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Stock por Categoría ({dateRange})</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockPorCategoria}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalStock" fill={ACCENT_COLOR} name="Unidades en Stock" />
            <Bar dataKey="valorTotal" fill={PRIMARY_COLOR} name="Valor Total (Bs.)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-oasis-danger" />
          Productos con Stock Crítico
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Producto</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Stock Actual</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Stock Mínimo</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acción</th>
              </tr>
            </thead>
            <tbody>
              {productosBajoStock.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-gray-900">{item.nombre}</td>
                  <td className="py-3 px-4 text-center text-oasis-danger font-semibold">{item.stock}</td>
                  <td className="py-3 px-4 text-center text-gray-700">{item.minStock}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-oasis-danger-light text-oasis-danger px-3 py-1 rounded-full text-sm font-semibold">
                      Reabastecer
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InventarioReportPage() {
  return (
    <Suspense fallback={<div>Cargando reporte de inventario...</div>}>
      <InventarioReportContent />
    </Suspense>
  );
}

export default InventarioReportPage;
