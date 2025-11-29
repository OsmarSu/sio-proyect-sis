'use client';

import React from 'react';

export type CustomersReportData = {
    totalCustomers: number;
    newCustomersThisMonth: number;
    topCustomers: {
        id: number;
        name: string;
        totalPurchases: number;
        totalSpent: number;
    }[];
};

interface CustomersReportClientProps {
    data: CustomersReportData;
}

export default function CustomersReportClient({ data }: CustomersReportClientProps) {
    const { totalCustomers, newCustomersThisMonth, topCustomers } = data;

    return (
        <div className="space-y-6">
            {/* KPIs Clientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Total Clientes Registrados</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalCustomers}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Nuevos este Mes</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">+{newCustomersThisMonth}</p>
                </div>
            </div>

            {/* Top Clientes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Mejores Clientes (Por Monto de Compra)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Compras Realizadas</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Gastado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {topCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{customer.totalPurchases}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">Bs. {customer.totalSpent.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
