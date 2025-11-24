// app/dashboard/reportes/productos/page.tsx
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
const ProductosReportPage = () => {
  const searchParams = useSearchParams();
  const dateRange = searchParams.get('range') || 'month';

  // Colores de tu paleta (referencia)
  const PRIMARY_COLOR = '#5556EE';
  const SUCCESS_COLOR = '#74AB41';

  // Datos de ejemplo (idealmente vendrían de una API, filtrados por dateRange)
  const productosMasVendidos = [
    { nombre: 'Lego City Policía', cantidad: 145, ingresos: 36250 },
    { nombre: 'Barbie Edición Especial', cantidad: 132, ingresos: 19800 },
    { nombre: 'Carro RC 4x4', cantidad: 98, ingresos: 17640 },
    { nombre: 'Monopoly Clásico', cantidad: 87, ingresos: 8700 },
    { nombre: 'Pelota de Fútbol', cantidad: 203, ingresos: 10150 }
  ];

  return (
    <div>
      {/* Productos Más Vendidos */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Productos Más Vendidos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productosMasVendidos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill={PRIMARY_COLOR} name="Cantidad Vendida" />
            <Bar dataKey="ingresos" fill={SUCCESS_COLOR} name="Ingresos (Bs.)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de Productos Detallada */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Detalle de Productos Más Vendidos</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Producto</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Cantidad</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Ingresos</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {productosMasVendidos.map((producto, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{producto.nombre}</td>
                  <td className="py-3 px-4 text-center text-gray-700">{producto.cantidad}</td>
                  <td className="py-3 px-4 text-right font-semibold text-oasis-success">Bs. {producto.ingresos.toLocaleString()}</td> {/* Usar custom color */}
                  <td className="py-3 px-4 text-center">
                    <span className="bg-oasis-success-light text-oasis-success px-3 py-1 rounded-full text-sm font-semibold"> {/* Usar custom color */}
                      Popular
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
};

export default ProductosReportPage;