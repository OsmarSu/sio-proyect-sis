// app/dashboard/reportes/inventario/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';

// Función de traducción para los rangos de fecha
const translateDateRange = (range: string) => {
  switch (range) {
    case 'today': return 'Hoy';
    case 'week': return 'Esta Semana';
    case 'month': return 'Este Mes';
    case 'year': return 'Este Año';
    case 'custom': return 'Personalizado';
    default: return range;
  }
};

function InventarioReportPage() {
  const searchParams = useSearchParams();
  const dateRange = searchParams.get('range') || 'month';

  // Colores de tu paleta (referencia)
  const PRIMARY_COLOR = '#5556EE';
  const DANGER_COLOR = '#DE6415';
  const ACCENT_COLOR = '#2EB4D1';

  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/reports/inventario?range=${dateRange}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Error al cargar los datos del reporte de inventario.');
        }
        const data = await res.json();
        setReportData(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching inventario report data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReportData();
  }, [dateRange]);

  if (isLoading) {
    return <div className="text-center p-8">Cargando reporte de inventario...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

  if (!reportData || (!reportData.stockPorCategoria?.length && !reportData.productosBajoStock?.length && !reportData.inventoryMovements?.length)) {
    return <div className="text-center p-8 text-gray-600">No hay datos disponibles para el reporte de inventario.</div>;
  }

  const handleDownload = async (format: 'pdf' | 'excel') => {
    try {
      const res = await fetch(`/api/reports/inventario?range=${dateRange}&format=${format}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_inventario.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Error al descargar el reporte");
      }
    } catch (error) {
      console.error("Error descarga:", error);
      alert("Error al descargar");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <button
          onClick={() => handleDownload('pdf')}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Descargar PDF
        </button>
        <button
          onClick={() => handleDownload('excel')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
        >
          Descargar Excel
        </button>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Stock por Categoría (Período: {translateDateRange(dateRange)})</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData.stockPorCategoria}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip formatter={(value: number, name: string, props: any) => [`${value} uds.`, name]} />
            <Legend />
            <Bar dataKey="totalStock" fill={ACCENT_COLOR} name="Unidades en Stock" />
            <Bar dataKey="valorTotal" fill={PRIMARY_COLOR} name="Valor Total (Bs.)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {reportData.productosBajoStock?.length > 0 && (
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
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Ubicación</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Acción</th>
                </tr>
              </thead>
              <tbody>
                {reportData.productosBajoStock.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.nombre}</td>
                    <td className="py-3 px-4 text-center text-oasis-danger font-semibold">{item.stock}</td>
                    <td className="py-3 px-4 text-center text-gray-700">{item.minStock}</td>
                    <td className="py-3 px-4 text-center text-gray-700">{item.ubicacion || 'N/A'}</td>
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
      )}

      {reportData.inventoryMovements?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Historial de Movimientos de Inventario</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha/Hora</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Producto</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Cantidad</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {reportData.inventoryMovements.map((mov: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">{mov.timestamp}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{mov.product}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{mov.type}</td>
                    <td className="py-3 px-4 text-center text-gray-700">{mov.quantity}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{mov.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventarioReportPage;