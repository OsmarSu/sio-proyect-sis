// app/dashboard/reportes/ventas/page.tsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';
// Colores de tu paleta (referencia)
const PRIMARY_COLOR = '#5556EE';
const SUCCESS_COLOR = '#74AB41';

function VentasReportPage() {
  const searchParams = useSearchParams();
  const dateRange = searchParams.get('range') || 'month';

  // Datos dummy de ventas para este reporte
  const ventasDiarias = [
    { dia: '01', total: 1200, items: 15 },
    { dia: '02', total: 1500, items: 18 },
    { dia: '03', total: 1300, items: 16 },
    { dia: '04', total: 1700, items: 20 },
    { dia: '05', total: 1600, items: 19 },
    { dia: '06', total: 2000, items: 25 },
    { dia: '07', total: 1800, items: 22 },
  ];

  const ventasPorVendedor = [
    { vendedor: 'Ana G.', ventas: 12000, comision: 1200 },
    { vendedor: 'Luis P.', ventas: 9500, comision: 950 },
    { vendedor: 'Marta R.', ventas: 11000, comision: 1100 },
    { vendedor: 'Carlos S.', ventas: 8000, comision: 800 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Ventas Diarias ({dateRange})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={ventasDiarias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="total" stroke={PRIMARY_COLOR} fillOpacity={1} fill="url(#colorVentas)" name="Ventas (Bs.)" />
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRIMARY_COLOR} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={PRIMARY_COLOR} stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Ventas por Vendedor</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vendedor</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Ventas (Bs.)</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Comisión (Bs.)</th>
                </tr>
              </thead>
              <tbody>
                {ventasPorVendedor.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.vendedor}</td>
                    <td className="py-3 px-4 text-right text-oasis-primary font-semibold">Bs. {item.ventas.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-oasis-success font-semibold">Bs. {item.comision.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VentasReportPage;