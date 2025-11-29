'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export type SalesReportData = {
    dailySales: { date: string; total: number }[];
    recentTransactions: {
        id: number;
        date: string;
        customer: string;
        total: number;
        items: number;
    }[];
};

interface SalesReportClientProps {
    data: SalesReportData;
}

export default function SalesReportClient({ data }: SalesReportClientProps) {
    const { dailySales, recentTransactions } = data;

    return (
        <div className="space-y-6">
            {/* Gráfico de Ventas Diarias */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ventas Diarias (Últimos 30 días)</h3>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => `Bs. ${Number(value).toLocaleString('es-BO')}`} />
                            <Legend />
                            <Bar dataKey="total" fill="#5556EE" name="Ventas (Bs.)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tabla de Transacciones Recientes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Transacciones Recientes</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Venta</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{tx.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.items}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">Bs. {tx.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
