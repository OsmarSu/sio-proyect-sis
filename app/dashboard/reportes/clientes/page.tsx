// app/dashboard/reportes/clientes/page.tsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, Star } from 'lucide-react';

// Colores de tu paleta (referencia)
const PRIMARY_COLOR = '#5556EE';
const SECONDARY_COLOR = '#8150CE';
const ACCENT_COLOR = '#2EB4D1';
const SUCCESS_COLOR = '#74AB41';

const PIE_COLORS_CLIENTES = [PRIMARY_COLOR, SECONDARY_COLOR, ACCENT_COLOR, SUCCESS_COLOR];

function ClientesReportPage() {
  const searchParams = useSearchParams();
  const dateRange = searchParams.get('range') || 'month';

  // Datos dummy de clientes
  const clientesPorTipo = [
    { tipo: 'Activos', count: 120, valor: 60 },
    { tipo: 'Nuevos', count: 30, valor: 15 },
    { tipo: 'Inactivos', count: 40, valor: 20 },
    { tipo: 'VIP', count: 10, valor: 5 },
  ];

  const clientesTopCompras = [
    { cliente: 'Juan Pérez', compras: 5, totalGastado: 1500 },
    { cliente: 'María G.', compras: 3, totalGastado: 1200 },
    { cliente: 'Pedro L.', compras: 7, totalGastado: 2100 },
    { cliente: 'Ana C.', compras: 4, totalGastado: 900 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Clientes por Tipo ({dateRange})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clientesPorTipo}
                cx="50%"
                cy="50%"
                labelLine={false}
                nameKey="tipo"
                label={(entry) => `${entry.name} ${entry.value}%`}
                outerRadius={100}
                dataKey="valor"
              >
                {clientesPorTipo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS_CLIENTES[index % PIE_COLORS_CLIENTES.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top Clientes por Compras</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientesTopCompras}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cliente" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalGastado" fill={PRIMARY_COLOR} name="Total Gastado (Bs.)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Detalle de Clientes Top</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Compras Realizadas</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Gastado (Bs.)</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Nivel</th>
              </tr>
            </thead>
            <tbody>
              {clientesTopCompras.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-gray-900">{item.cliente}</td>
                  <td className="py-3 px-4 text-center text-gray-700">{item.compras}</td>
                  <td className="py-3 px-4 text-right text-oasis-primary font-semibold">Bs. {item.totalGastado.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center justify-center gap-1">
                      <Star className="w-4 h-4" /> VIP
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

export default ClientesReportPage;