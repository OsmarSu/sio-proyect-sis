// app/dashboard/reportes/productos/page.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Importar useState y useEffect
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react'; // Para el icono de stock crítico

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

function ProductosReportPage() {
  const searchParams = useSearchParams();
  const dateRange = searchParams.get('range') || 'month';

  // Colores de tu paleta (referencia)
  const PRIMARY_COLOR = '#5556EE';
  const SUCCESS_COLOR = '#74AB41';
  const DANGER_COLOR = '#DE6415'; // Necesario para estado de stock

  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/reports/productos?range=${dateRange}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Error al cargar los datos del reporte.');
        }
        const data = await res.json();
        setReportData(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching productos report data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReportData();
  }, [dateRange]);

  if (isLoading) {
    return <div className="text-center p-8">Cargando reporte de productos...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

  if (!reportData || (!reportData.productosMasVendidos?.length && !reportData.stockActual?.length && !reportData.activityLog?.length)) {
    return <div className="text-center p-8 text-gray-600">No hay datos disponibles para el reporte de productos.</div>;
  }

  return (
    <div>
      {/* Productos Más Vendidos */}
      {reportData.productosMasVendidos?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Productos Más Vendidos (Período: {translateDateRange(dateRange)})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.productosMasVendidos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              
              <Tooltip formatter={(value: number, name: string) => (name === "Cantidad Vendida" ? [`${value} uds.`, name] : [`Bs. ${value.toLocaleString('es-BO')}`, name])} />
              <Legend />
              <Bar dataKey="cantidad" fill={PRIMARY_COLOR} name="Cantidad Vendida" />
              <Bar dataKey="ingresos" fill={SUCCESS_COLOR} name="Ingresos (Bs.)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stock Actual de Productos */}
      {reportData.stockActual?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Stock Actual de Productos (Período: {translateDateRange(dateRange)})</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Producto</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Stock Actual</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Stock Mínimo</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Ubicación</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reportData.stockActual.map((producto: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{producto.nombre}</td>
                    <td className="py-3 px-4 text-center text-gray-700">{producto.stockActual}</td>
                    <td className="py-3 px-4 text-center text-gray-700">{producto.minStock}</td>
                    <td className="py-3 px-4 text-center text-gray-700">{producto.ubicacion || 'N/A'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        producto.stockActual < producto.minStock ? 'bg-oasis-danger-light text-oasis-danger' : 'bg-oasis-success-light text-oasis-success'
                      }`}>
                        {producto.stockActual < producto.minStock ? 'Bajo Stock' : 'En Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Historial Detallado / Bitácora */}
      {reportData.activityLog?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Bitácora de Actividades de Productos</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha/Hora</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Acción</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuario</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Producto ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.activityLog.map((log: any, index: number) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-600">{log.timestamp}</td>
                                <td className="py-3 px-4 font-semibold text-gray-900">{log.action}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{log.user}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{log.productId || 'N/A'}</td>
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

export default ProductosReportPage;