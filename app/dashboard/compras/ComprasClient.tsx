'use client';

import { useState } from 'react';
import { Supply } from './types';
import CompraModal from './components/CompraModal';
import { createCompraAction, CompraItem } from '@/app/actions/compra-actions';

interface ComprasClientProps {
    initialSupplies: Supply[];
    productsList: { id: number; nombre: string }[];
    providersList: { id: number; nombre: string }[];
}

export default function ComprasClient({ initialSupplies, productsList, providersList }: ComprasClientProps) {
    const [supplies, setSupplies] = useState<Supply[]>(initialSupplies);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredSupplies = supplies.filter(s =>
        s.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toString().includes(searchTerm)
    );

    const handleCreateCompra = async (proveedorId: number, items: CompraItem[]) => {
        try {
            const result = await createCompraAction(proveedorId, items);
            if (result.success) {
                alert("Compra registrada exitosamente");
                setIsModalOpen(false);
                // Opcional: recargar la página o actualizar estado local si devolviéramos el objeto completo formateado
                window.location.reload();
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Error inesperado");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Compras</h1>
                    <p className="text-gray-500 text-sm mt-1">Historial de suministros y entradas de inventario.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    <span>Nueva Compra</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                    <input
                        type="text"
                        placeholder="Buscar por proveedor o ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full max-w-md pl-4 pr-3 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-1 focus:ring-green-500"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Ver</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSupplies.length > 0 ? (
                                filteredSupplies.map((supply) => (
                                    <tr key={supply.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{supply.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supply.proveedor}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(supply.fecha).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supply.items}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Bs. {supply.total.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {supply.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-green-600 hover:text-green-900">Detalles</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No se encontraron compras.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CompraModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleCreateCompra}
                productos={productsList}
                proveedores={providersList}
            />
        </div>
    );
}
