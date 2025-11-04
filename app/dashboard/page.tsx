// app/dashboard/page.tsx
import StatCard from "@/components/dashboard/StatCard";
import Button from "@/components/ui/Button";

// Importamos nuestros íconos
import PackageIcon from "@/components/icons/PackageIcon";
import ShoppingCartIcon from "@/components/icons/ShoppingCartIcon";
import UsersIcon from "@/components/icons/UsersIcon";
import TruckIcon from "@/components/icons/TruckIcon";
import PlusIcon from "@/components/icons/PlusIcon";

import LowStockList from "./components/LowStockList";
import RecentSalesList from "./components/RecentSalesList";
import QuickAccessGrid from "./components/QuickAccessGrid";

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Inicio</h1>
              <p className="text-gray-600 text-base">
                Bienvenido al sistema de gestión de la Juguetería Oasis
              </p>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            icon={<PlusIcon className="h-4 w-4" />}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
          >
            Nueva Venta
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <PackageIcon className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">↑ 12%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Productos en Stock</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">1,234</p>
          <p className="text-gray-500 text-xs">Total de productos</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ShoppingCartIcon className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">↑ 23%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Ventas del Mes</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">Bs. 45,678</p>
          <p className="text-gray-500 text-xs">Total de ventas</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">↑ 5%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Clientes Activos</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">89</p>
          <p className="text-gray-500 text-xs">Clientes registrados</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TruckIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Proveedores</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">15</p>
          <p className="text-gray-500 text-xs">Proveedores activos</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <LowStockList />
          <RecentSalesList />
        </div>

        <div className="lg:col-span-1">
          <QuickAccessGrid />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;