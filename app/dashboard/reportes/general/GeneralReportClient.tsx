'use client';

import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from 'lucide-react';

export type GeneralReportData = {
    metrics: {
        totalVentas: number;
        totalProductos: number;
        nuevosClientes: number;
        ticketPromedio: number;
    };
    ventasMensuales: { mes: string; ventas: number }[];
    ventasPorCategoria: { categoria: string; valor: number; monto: number }[];
};

interface GeneralReportClientProps {
    data: GeneralReportData;
}

export default function GeneralReportClient({ data }: GeneralReportClientProps) {
    const { metrics, ventasMensuales, ventasPorCategoria } = data;

    // Colores
    const PRIMARY_COLOR = '#5556EE';
    const PIE_CHART_COLORS = ['#5556EE', '#8150CE', '#DE6415', '#74AB41', '#2EB4D1'];

    const metricasCards = [
        {
            titulo: 'Ventas Totales',
            valor: `Bs. ${metrics.totalVentas.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            bgColorClass: 'bg-green-100',
            iconColorClass: 'text-green-600',
        },
        {
            titulo: 'Productos Vendidos',
            valor: metrics.totalProductos.toLocaleString('es-BO'),
            icon: Package,
            bgColorClass: 'bg-blue-100',
            iconColorClass: 'text-blue-600',
        },
        {
            titulo: 'Clientes Nuevos',
            valor: metrics.nuevosClientes.toLocaleString('es-BO'),
            icon: Users,
            bgColorClass: 'bg-purple-100',
            iconColorClass: 'text-purple-600',
        },
        {
            titulo: 'Ticket Promedio',
            valor: `Bs. ${metrics.ticketPromedio.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`,
            icon: ShoppingCart,
            bgColorClass: 'bg-orange-100',
            iconColorClass: 'text-orange-600',
        },
    ];

    return (
        <div>
            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metricasCards.map((metrica, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`${metrica.bgColorClass} p-3 rounded-xl`}>
                                <metrica.icon className={`w-6 h-6 ${metrica.iconColorClass}`} />
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
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ventasMensuales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip formatter={(value) => `Bs. ${Number(value).toLocaleString('es-BO')}`} />
                                <Legend />
                                <Line type="monotone" dataKey="ventas" stroke={PRIMARY_COLOR} strokeWidth={3} name="Ventas (Bs.)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Ventas por Categoría */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Ventas por Categoría</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ventasPorCategoria}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.name} (${entry.percent.toFixed(0)}%)`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="valor"
                                    nameKey="categoria"
                                >
                                    {ventasPorCategoria.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `Bs. ${Number(value).toLocaleString('es-BO')}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
