import React from 'react';
import Badge from '@/components/ui/Badge';

interface PurchaseCardProps {
  purchase: any;
  onView: (purchase: any) => void;
  onReceive: (id: string) => void;
}

const PurchaseCard = ({ purchase, onView, onReceive }: PurchaseCardProps) => {
  const statusColors = {
    PENDIENTE: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente' },
    RECIBIDA: { bg: 'bg-green-100', text: 'text-green-700', label: 'Recibida' },
    CANCELADA: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelada' },
  };

  const status = statusColors[purchase.status as keyof typeof statusColors];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900">
              {purchase.purchaseNumber}
            </h3>
            <span className={`px-3 py-1 ${status.bg} ${status.text} text-xs font-semibold rounded-full`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Proveedor: <span className="font-semibold text-gray-900">{purchase.supplierName}</span>
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">Bs. {purchase.total.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
        <div>
          <p className="text-xs text-gray-500 mb-1">Fecha de Compra</p>
          <p className="text-sm font-semibold text-gray-900">
            {new Date(purchase.purchaseDate).toLocaleDateString('es-BO')}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Fecha de Entrega</p>
          <p className="text-sm font-semibold text-gray-900">
            {purchase.deliveryDate 
              ? new Date(purchase.deliveryDate).toLocaleDateString('es-BO')
              : 'Por definir'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Productos</p>
          <p className="text-sm font-semibold text-gray-900">
            {purchase.items.length} item{purchase.items.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onView(purchase)}
          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold"
        >
          Ver Detalle
        </button>
        
        {purchase.status === 'PENDIENTE' && (
          <button
            onClick={() => onReceive(purchase.id)}
            className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-semibold"
          >
            Recibir Compra
          </button>
        )}
      </div>
    </div>
  );
};

export default PurchaseCard;