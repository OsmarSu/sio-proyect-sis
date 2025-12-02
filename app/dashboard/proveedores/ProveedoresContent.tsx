'use client';

import React, { useState } from 'react';
import ProviderModal, { ProviderData, ProviderSaveData } from './components/ProviderModal';
import { createProvider, updateProvider, deleteProvider } from '@/actions/provider-actions';

interface ProveedoresContentProps {
    initialProviders: ProviderData[];
}

export function ProveedoresContent({ initialProviders }: ProveedoresContentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [providers, setProviders] = useState<ProviderData[]>(initialProviders);
    const [providerToEdit, setProviderToEdit] = useState<ProviderData | null>(null);

    // --- ✨ LÓGICA DE PAGINACIÓN (VISUAL) ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(providers.length / itemsPerPage);

    const paginatedProviders = providers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    // ---

    const handleSave = async (data: ProviderSaveData) => {
        try {
            if (data.id) {
                const res = await updateProvider(data);
                if (res.success) {
                    // Optimistic update or reload
                    window.location.reload();
                } else {
                    alert('Error al actualizar: ' + res.error);
                }
            } else {
                const res = await createProvider(data);
                if (res.success) {
                    window.location.reload();
                } else {
                    alert('Error al crear: ' + res.error);
                }
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error inesperado');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("¿Estás seguro de eliminar este proveedor?")) {
            const res = await deleteProvider(id);
            if (res.success) {
                setProviders((prev) => prev.filter((p) => p.id !== id));
            } else {
                alert('Error al eliminar: ' + res.error);
            }
        }
    };

    const handleOpenCreate = () => {
        setProviderToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (provider: ProviderData) => {
        setProviderToEdit(provider);
        setIsModalOpen(true);
    };

    const goToNextPage = () => {
        setCurrentPage((page) => Math.min(page + 1, totalPages));
    };
    const goToPrevPage = () => {
        setCurrentPage((page) => Math.max(page - 1, 1));
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Gestión de Proveedores
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Administra tu lista de contactos y proveedores.
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    <span>Nuevo Proveedor</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                    <input
                        type="text"
                        placeholder="Buscar por Razón Social o RUC..."
                        className="block w-full max-w-md pl-4 pr-3 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                    Razón Social
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                    Contacto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                    Teléfono
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                    Email
                                </th>
                                <th className="relative px-6 py-3">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedProviders.map((prov) => (
                                <tr
                                    key={prov.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {prov.razonSocial}
                                        </div>
                                        <div className="text-xs text-gray-500">RUC: {prov.ruc}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {prov.contacto}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {prov.telefono}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {prov.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleOpenEdit(prov)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(prov.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {paginatedProviders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No hay proveedores registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- ✨ SECCIÓN DE PAGINACIÓN VISUAL --- */}
                <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                    <div className="text-sm text-gray-500">
                        Página <span className="font-medium text-gray-800">{currentPage}</span> de <span className="font-medium text-gray-800">{totalPages || 1}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
                {/* --- FIN DE SECCIÓN --- */}

            </div>

            <ProviderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                providerToEdit={providerToEdit}
            />
        </div>
    );
}
