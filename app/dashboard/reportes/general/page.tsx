// app/dashboard/reportes/general/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

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

function GeneralReportPage() {
    const searchParams = useSearchParams();
    const dateRange = searchParams.get('range') || 'month';

    // Colores de tu paleta (referencia)
    const PRIMARY_COLOR = '#5556EE';
    const SECONDARY_COLOR = '#8150CE';
    const SUCCESS_COLOR = '#74AB41';
    const DANGER_COLOR = '#DE6415';
    const ACCENT_COLOR = '#2EB4D1';

    const PIE_CHART_COLORS = [PRIMARY_COLOR, SECONDARY_COLOR, DANGER_COLOR, SUCCESS_COLOR, ACCENT_COLOR];

    const [reportData, setReportData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReportData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/reports/general?range=${dateRange}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Error al cargar los datos del reporte.');
                }
                const data = await res.json();
                setReportData(data);
            } catch (err: any) {
                setError(err.message);
                console.error('Error fetching general report data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReportData();
    }, [dateRange]);

    if (isLoading) {
        return <div className="text-center p-8">Cargando reporte general...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">Error: {error}</div>;
    }

    if (!reportData) {
        return <div className="text-center p-8 text-gray-600">No hay datos disponibles para el reporte general.</div>;
    }

    return (
        <div>
            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {reportData.metrics.map((metrica: any, index: number) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`${metrica.trend === 'up' ? 'bg-oasis-success-light' : 'bg-oasis-danger-light'} p-3 rounded-xl`}>
                                {metrica.titulo === 'Ventas Totales' && <DollarSign className={`w-6 h-6 ${metrica.trend === 'up' ? 'text-oasis-success' : 'text-oasis-danger'}`} />}
                                {metrica.titulo === 'Productos Vendidos' && <Package className={`w-6 h-6 ${metrica.trend === 'up' ? 'text-oasis-success' : 'text-oasis-danger'}`} />}
                                {metrica.titulo === 'Clientes Nuevos' && <Users className={`w-6 h-6 ${metrica.trend === 'up' ? 'text-oasis-success' : 'text-oasis-danger'}`} />}
                                {metrica.titulo === 'Ticket Promedio' && <ShoppingCart className={`w-6 h-6 ${metrica.trend === 'up' ? 'text-oasis-success' : 'text-oasis-danger'}`} />}
                            </div>
                            <div className={`flex items-center gap-1 ${metrica.trend === 'up' ? 'text-oasis-success' : 'text-oasis-danger'} text-sm font-semibold`}>
                                {metrica.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                {metrica.cambio}
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm mb-1">{metrica.titulo}</h3>
                        <p className="text-3xl font-bold text-gray-900">{metrica.valor}</p>
                    </div>
                ))}
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Ventas Mensuales */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Ventas Mensuales (Período: {translateDateRange(dateRange)})</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={reportData.ventasMensuales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `Bs. ${value.toLocaleString('es-BO')}`} /> {/* Formato de moneda */}
                            <Legend />
                            <Line type="monotone" dataKey="ventas" stroke={PRIMARY_COLOR} strokeWidth={3} name="Ventas (Bs.)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Ventas por Categoría */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Ventas por Categoría (Período: {translateDateRange(dateRange)})</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={reportData.ventasPorCategoria}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => `${entry.payload.categoria} ${entry.payload.valor}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="valor"
                            >
                                {reportData.ventasPorCategoria.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number, name: string, props: any) => [`Bs. ${props.payload.monto.toLocaleString('es-BO')}`, name]} /> {/* Mostrar monto en tooltip */}
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Historial Detallado / Bitácora */}
            {reportData.activityLog?.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Bitácora de Actividades Recientes</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha/Hora</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Acción</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.activityLog.map((log: any, index: number) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-600">{log.timestamp}</td>
                                        <td className="py-3 px-4 font-semibold text-gray-900">{log.action}</td>
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

export default GeneralReportPage;