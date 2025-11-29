'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export type InventoryReportData = {
    totalValue: number;
    lowStockCount: number;
    totalItems: number;
    stockByCategory: { name: string; value: number }[];
    lowStockItems: {
        id: number;
        name: string;
        stock: number;
        category: string;
    }[];
};

interface InventoryReportClientProps {
    data: InventoryReportData;
}

export default function InventoryReportClient({ data }: InventoryReportClientProps) {
    const { totalValue, lowStockCount, totalItems, stockByCategory, lowStockItems } = data;
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="space-y-6">
            {/* KPIs Inventario */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Valor Total Inventario (Est.)</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">Bs. {totalValue.toLocaleString('es-BO')}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Total Unidades</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{totalItems.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Productos Stock Bajo</h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">{lowStockCount}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribución por Categoría */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Distribución de Stock por Categoría</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stockByCategory}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {stockByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Alerta de Stock Bajo */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-red-600 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Alerta de Stock Bajo
                    </h3>
                    <div className="overflow-y-auto max-h-[300px]">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Producto</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Categoría</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {lowStockItems.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{item.category}</td>
                                        <td className="px-4 py-3 text-sm font-bold text-red-600 text-right">{item.stock}</td>
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
