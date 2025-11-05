import React from 'react';
import PurchaseCard from './PurchaseCard';

interface PurchaseListProps {
  purchases: any[];
  onView: (purchase: any) => void;
  onReceive: (id: string) => void;
}

const PurchaseList = ({ purchases, onView, onReceive }: PurchaseListProps) => {
  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No hay compras registradas
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza registrando una nueva compra.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="space-y-4">
        {purchases.map((purchase) => (
          <PurchaseCard
            key={purchase.id}
            purchase={purchase}
            onView={onView}
            onReceive={onReceive}
          />
        ))}
      </div>
    </div>
  );
};

export default PurchaseList;