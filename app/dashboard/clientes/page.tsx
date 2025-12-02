'use client';

import React, { useState } from 'react';
import { useClients } from './hooks/useClients';
import { Client } from './types';
import ClientModal from './components/ClientModal';
import { Search, UserPlus, Phone, Mail, MapPin } from 'lucide-react';

export default function ClientsPage() {
  const {
    clients,
    searchTerm,
    setSearchTerm,
    filterActive,
    setFilterActive,
    saveClient,
    deleteClient,
    filteredCount,
    totalClients,
  } = useClients();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  // Paginación simple
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCount / itemsPerPage);
  const paginatedClients = clients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenCreateClient = () => {
    setClientToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditClient = (client: Client) => {
    setClientToEdit(client);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado con Botón Mejorado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
          <p className="text-gray-500 text-sm mt-1">
            Total: {totalClients} clientes ({filteredCount} filtrados)
          </p>
        </div>
        
        {/* BOTÓN NUEVO CLIENTE (MEJORADO) */}
        <button
          onClick={handleOpenCreateClient}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md font-medium active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          <span>Registrar Nuevo Cliente</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
          className="w-full md:w-1/4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="all">Todos los clientes</option>
          <option value="active">Solo activos</option>
          <option value="inactive">Solo inactivos</option>
        </select>
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                {/* COLUMNA PUNTOS ELIMINADA AQUÍ */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{client.name}</div>
                    <div className="text-xs text-gray-500">ID: {client.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" /> {client.email}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-700 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" /> {client.phone}
                    </div>
                    {client.address && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" /> {client.address}
                      </div>
                    )}
                  </td>
                  {/* CELDA PUNTOS ELIMINADA AQUÍ */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        client.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {client.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenEditClient(client)}
                      className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCount === 0 && (
          <div className="text-center p-12 bg-white">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron clientes</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta ajustar tus filtros o registrar un nuevo cliente.
            </p>
          </div>
        )}

        {/* Paginación */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
          <div className="text-sm text-gray-500">
            Mostrando <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, filteredCount)}</span> de{" "}
            <span className="font-medium text-gray-900">{filteredCount}</span> resultados
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || filteredCount === 0}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={saveClient}
        clientToEdit={clientToEdit}
      />
    </div>
  );
}