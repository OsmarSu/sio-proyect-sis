'use client';

import { useState, useEffect } from 'react';
import PurchaseList from './components/PurchaseList';
import PurchaseModal from './components/PurchaseModal';
import PurchaseDetailModal from './components/PurchaseDetailModal';
import { mockPurchases } from '@/lib/data/mockPurchases';

export default function ComprasPage() {
  const [purchases, setPurchases] = useState(mockPurchases);
  const [filteredPurchases, setFilteredPurchases] = useState(mockPurchases);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar compras
  useEffect(() => {
    let filtered = [...purchases];

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.purchaseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de estado
    if (statusFilter) {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Ordenar por fecha más reciente
    filtered.sort((a, b) => 
      new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    );

    setFilteredPurchases(filtered);
  }, [searchTerm, statusFilter, purchases]);

  const handleView = (purchase: any) => {
    setSelectedPurchase(purchase);
    setIsDetailModalOpen(true);
  };

  const handleReceive = (id: string) => {
    if (!confirm('¿Confirmar recepción de esta compra? Esto actualizará el stock de los productos.')) {
      return;
    }

    setPurchases(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: 'RECIBIDA', receivedDate: new Date() }
          : p
      )
    );

    alert('Compra recibida exitosamente. Stock actualizado.');
  };

  const handleSave = (purchase: any) => {
    setPurchases(prev => [...prev, purchase]);
    setIsModalOpen(false);
    alert('Compra registrada exitosamente');
  };

  // Calcular estadísticas
  const stats = {
    total: purchases.length,
    pendientes: purchases.filter(p => p.status === 'PENDIENTE').length,
    recibidas: purchases.filter(p => p.status === 'RECIBIDA').length,
    totalMonto: purchases.reduce((sum, p) => sum + p.total, 0),
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro de Compras</h1>
              <p className="text-gray-600 text-base">
                Gestiona las compras a proveedores ({filteredPurchases.length} compras)
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Compra
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total de Compras</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Pendientes</p>
          <p className="text-3xl font-bold text-gray-900">{stats.pendientes}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Recibidas</p>
          <p className="text-3xl font-bold text-gray-900">{stats.recibidas}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Monto Total</p>
          <p className="text-3xl font-bold text-gray-900">Bs. {stats.totalMonto.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Buscar por número de compra o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="RECIBIDA">Recibida</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Lista de compras */}
      <PurchaseList
        purchases={filteredPurchases}
        onView={handleView}
        onReceive={handleReceive}
      />

      {/* Modales */}
      {isModalOpen && (
        <PurchaseModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {isDetailModalOpen && selectedPurchase && (
        <PurchaseDetailModal
          purchase={selectedPurchase}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedPurchase(null);
          }}
        />
      )}
    </div>
  );
}