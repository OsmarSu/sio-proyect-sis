'use client';

import React from 'react';

interface PurchaseDetailModalProps {
  purchase: any;
  onClose: () => void;
}

const PurchaseDetailModal = ({ purchase, onClose }: PurchaseDetailModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Detalle de Compra
            </h2>
            <p className="text-sm text-gray-600">{purchase.purchaseNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Proveedor</p>
              <p className="text-lg font-semibold text-gray-900">{purchase.supplierName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Estado</p>
              <p className="text-lg font-semibold text-gray-900">{purchase.status}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Fecha de Compra</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(purchase.purchaseDate).toLocaleDateString('es-BO')}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Fecha de Entrega</p>
              <p className="text-lg font-semibold text-gray-900">
                {purchase.deliveryDate 
                  ? new Date(purchase.deliveryDate).toLocaleDateString('es-BO')
                  : 'Por definir'}
              </p>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Productos</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Producto</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Cantidad</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Costo Unit.</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {purchase.items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-500">{item.product.code}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-900">Bs. {item.unitCost.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        Bs. {item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totales */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-900">Bs. {purchase.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IVA (18%):</span>
              <span className="font-semibold text-gray-900">Bs. {purchase.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-300 pt-2">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-gray-900">Bs. {purchase.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Notas */}
          {purchase.notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Notas</h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{purchase.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetailModal;