// app/dashboard/reportes/clientes/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, Star } from 'lucide-react';

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

// Colores de tu paleta (referencia)
const PRIMARY_COLOR = '#5556EE';
const SECONDARY_COLOR = '#8150CE';
const ACCENT_COLOR = '#2EB4D1';
const SUCCESS_COLOR = '#74AB41';
const DANGER_COLOR = '#DE6415';

const PIE_COLORS_CLIENTES = [PRIMARY_COLOR, SECONDARY_COLOR, ACCENT_COLOR, SUCCESS_COLOR, DANGER_COLOR];

function ClientesReportPage() {
  const searchParams = useSearchParams();
  const dateRange = searchParams.get('range') || 'month';

  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/reports/clientes?range=${dateRange}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Error al cargar los datos del reporte de clientes.');
        }
        const data = await res.json();
        setReportData(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching clientes report data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReportData();
  }, [dateRange]);

  if (isLoading) {
    return <div className="text-center p-8">Cargando reporte de clientes...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

  if (!reportData || (!reportData.clientesPorTipo?.length && !reportData.clientesTopCompras?.length && !reportData.clientActivityLog?.length)) {
    return <div className="text-center p-8 text-gray-600">No hay datos disponibles para el reporte de clientes.</div>;
  }

  const handleDownload = async (format: 'pdf' | 'excel') => {
    try {
      const res = await fetch(`/api/reports/clientes?range=${dateRange}&format=${format}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_clientes.${format === 'excel' ? 'xlsx' : 'pdf'}`;
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportData.clientesPorTipo?.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Clientes por Tipo (Período: {translateDateRange(dateRange)})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.clientesPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}

                  outerRadius={100}
                  dataKey="valor"
                >
                  {reportData.clientesPorTipo.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS_CLIENTES[index % PIE_COLORS_CLIENTES.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string, props: any) => [`${props.payload.count} clientes`, name]} /> {/* Mostrar cantidad de clientes */}
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {reportData.clientesTopCompras?.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Top Clientes por Compras (Período: {translateDateRange(dateRange)})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.clientesTopCompras}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cliente" />

                <Tooltip formatter={(value: number, name: string) => [`Bs. ${value.toLocaleString('es-BO')}`, name]} />
                <Legend />
                <Bar dataKey="totalGastado" fill={PRIMARY_COLOR} name="Total Gastado (Bs.)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {reportData.clientActivityLog?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Bitácora de Clientes</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha/Hora</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Acción</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {reportData.clientActivityLog.map((log: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">{log.timestamp}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{log.clientName}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{log.action}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{log.user}</td>
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

export default ClientesReportPage;