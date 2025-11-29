'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export type ProductsReportData = {
    topSelling: { name: string; quantity: number }[];
    productsList: {
        id: number;
        name: string;
        category: string;
        price: number;
        stock: number;
        sold: number;
    }[];
};

interface ProductsReportClientProps {
    data: ProductsReportData;
}

export default function ProductsReportClient({ data }: ProductsReportClientProps) {
    const { topSelling, productsList } = data;

    return (
        <div className="space-y-6">
            {/* Top Productos Vendidos */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Top 10 Productos Más Vendidos</h3>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topSelling} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} style={{ fontSize: '12px' }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="quantity" fill="#8884d8" name="Unidades Vendidas" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Listado Detallado */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Rendimiento de Productos</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Vendidos</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {productsList.map((prod) => (
                                <tr key={prod.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">Bs. {prod.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{prod.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 text-right">{prod.sold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
