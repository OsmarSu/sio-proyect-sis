// app/dashboard/reportes/general/page.tsx
'use client';

import React, { Suspense } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function GeneralReportContent() {
    const searchParams = useSearchParams();
    const dateRange = searchParams.get('range') || 'month';

    // Colores de tu paleta (referencia)
    const PRIMARY_COLOR = '#5556EE';
    const SECONDARY_COLOR = '#8150CE';
    const SUCCESS_COLOR = '#74AB41';
    const DANGER_COLOR = '#DE6415';
    const ACCENT_COLOR = '#2EB4D1';

    // Datos de ejemplo (idealmente vendrían de una API, filtrados por dateRange)
    const ventasMensuales = [
        { mes: 'Ene', ventas: 45678, productos: 234 },
        { mes: 'Feb', ventas: 52341, productos: 267 },
        { mes: 'Mar', ventas: 48932, productos: 245 },
        { mes: 'Abr', ventas: 61245, productos: 312 },
        { mes: 'May', ventas: 58679, productos: 298 },
        { mes: 'Jun', ventas: 67432, productos: 341 },
    ];

    const ventasPorCategoria = [
        { categoria: 'Construcción', valor: 35, monto: 67432 },
        { categoria: 'Muñecas', valor: 25, monto: 48210 },
        { categoria: 'Deportes', valor: 20, monto: 38567 },
        { categoria: 'Juegos', valor: 15, monto: 28934 },
        { categoria: 'Otros', valor: 5, monto: 9634 },
    ];

    const PIE_CHART_COLORS = [PRIMARY_COLOR, SECONDARY_COLOR, DANGER_COLOR, SUCCESS_COLOR, ACCENT_COLOR];

    const metricas = [
        {
            titulo: 'Ventas Totales',
            valor: 'Bs. 192,777',
            cambio: '+23%',
            icon: DollarSign,
            bgColorClass: 'bg-oasis-success-light', // Usar custom color de Tailwind
            iconColorClass: 'text-oasis-success', // Usar custom color de Tailwind
            trend: 'up',
        },
        {
            titulo: 'Productos Vendidos',
            valor: '1,697',
            cambio: '+12%',
            icon: Package,
            bgColorClass: 'bg-oasis-primary-light',
            iconColorClass: 'text-oasis-primary',
            trend: 'up',
        },
        {
            titulo: 'Clientes Nuevos',
            valor: '34',
            cambio: '+5%',
            icon: Users,
            bgColorClass: 'bg-oasis-secondary-light',
            iconColorClass: 'text-oasis-secondary',
            trend: 'up',
        },
        {
            titulo: 'Ticket Promedio',
            valor: 'Bs. 513',
            cambio: '-3%',
            icon: ShoppingCart,
            bgColorClass: 'bg-oasis-danger-light',
            iconColorClass: 'text-oasis-danger',
            trend: 'down',
        },
    ];

    return (
        <div>
            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metricas.map((metrica, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`${metrica.bgColorClass} p-3 rounded-xl`}>
                                <metrica.icon className={`w-6 h-6 ${metrica.iconColorClass}`} />
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
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Ventas Mensuales</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={ventasMensuales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="ventas" stroke={PRIMARY_COLOR} strokeWidth={3} name="Ventas (Bs.)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Ventas por Categoría */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Ventas por Categoría</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={ventasPorCategoria}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => `${entry.payload.categoria} ${entry.payload.valor}%`}
                                outerRadius={100}
                                fill="#8884d8" // Default fill, overwritten by Cells
                                dataKey="valor"
                            >
                                {ventasPorCategoria.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

function GeneralReportPage() {
    return (
        <Suspense fallback={<div>Cargando reporte general...</div>}>
            <GeneralReportContent />
        </Suspense>
    );
}

export default GeneralReportPage;
