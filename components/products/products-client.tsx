'use client';

import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { ProductWithDetails } from '@/actions/get-products'; // Importamos tu tipo
import { Badge } from '@/components/ui/Badge';

interface ProductsClientProps {
  initialProducts: ProductWithDetails[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  // Aquí podríamos agregar estados para filtros de categoría/marca en el futuro

  const filteredProducts = initialProducts.filter(product => 
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función auxiliar para formatear dinero
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', { // Ajusta a tu moneda local
      style: 'currency',
      currency: 'BOB',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Catálogo de Productos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona tu inventario, precios e imágenes
          </p>
        </div>
        <div className="flex gap-2">
           {/* Botón secundario para filtros (UX Pro) */}
          <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm text-sm">
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* 2. MAIN TABLE CARD */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Barra de Búsqueda */}
        <div className="p-5 border-b border-gray-100 bg-white">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Buscar por nombre, código o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">PRODUCTO</th>
                <th className="px-6 py-4">CATEGORÍA / MARCA</th>
                <th className="px-6 py-4">PRECIO</th>
                <th className="px-6 py-4">ESTADO / STOCK</th>
                <th className="px-6 py-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    
                    {/* Columna 1: Imagen y Nombre */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Miniatura de Imagen */}
                        <div className="h-12 w-12 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                            {product.imagenUrl && product.imagenUrl !== 'https://placehold.co/600x400?text=No+Image' ? (
                                <img 
                                    src={product.imagenUrl} 
                                    alt={product.nombre} 
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Package className="w-5 h-5 text-gray-300" />
                            )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.nombre}</div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">
                            {product.codigo}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Columna 2: Clasificación */}
                    <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-700 font-medium">{product.categoria}</span>
                            <span className="text-xs text-gray-500">{product.marca}</span>
                        </div>
                    </td>

                    {/* Columna 3: Precio */}
                    <td className="px-6 py-4 font-medium text-gray-900">
                        {formatCurrency(product.precio)}
                    </td>

                    {/* Columna 4: Stock Status */}
                    <td className="px-6 py-4">
                       <div className="flex flex-col items-start gap-1.5">
                           {/* Lógica de Badge según estado */}
                           {product.estado === 'DISPONIBLE' && (
                               <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                                   <CheckCircle2 className="w-3 h-3 mr-1" /> Disponible
                               </Badge>
                           )}
                           {product.estado === 'STOCK BAJO' && (
                               <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
                                   <AlertTriangle className="w-3 h-3 mr-1" /> Stock Bajo
                               </Badge>
                           )}
                           {product.estado === 'AGOTADO' && (
                               <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
                                   <XCircle className="w-3 h-3 mr-1" /> Agotado
                               </Badge>
                           )}
                           
                           <span className="text-xs text-gray-500 pl-1">
                               {product.stock} unidades en total
                           </span>
                       </div>
                    </td>

                    {/* Columna 5: Acciones (Menu kebab) */}
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                            <Search className="w-6 h-6 text-gray-300" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">No se encontraron productos</p>
                            <p className="text-sm mt-1">Prueba con otro término de búsqueda</p>
                        </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Paginación Mock */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/30">
            <span>Mostrando {filteredProducts.length} productos</span>
            <div className="flex gap-2">
                <button disabled className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 transition-colors">Anterior</button>
                <button disabled className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 transition-colors">Siguiente</button>
            </div>
        </div>

      </div>
    </div>
  );
}