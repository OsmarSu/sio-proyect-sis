'use client';

import { useState } from 'react';
import { ProductWithDetails } from '@/actions/get-products';
import { Category } from '@/actions/get-categories';
import { Brand } from '@/actions/get-brands';
import { ProductForm } from './product-form';
import { deleteProduct } from '@/actions/product-actions';
import { ProductCard } from './product-card';

interface ProductsGridProps {
  initialProducts: ProductWithDetails[];
  categories: Category[];
  brands: Brand[];
}

export function ProductsGrid({ initialProducts, categories, brands }: ProductsGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithDetails | null>(null);

  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory;
    const matchesStock = !showLowStock || product.estado === 'STOCK BAJO';
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleEdit = (product: ProductWithDetails) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    const result = await deleteProduct(id);
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    window.location.reload(); // Recargar para ver cambios
  };

  return (
    <>
      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-11 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.nombre}>
                {cat.nombre}
              </option>
            ))}
          </select>

          {/* Low Stock Filter */}
          <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={showLowStock}
              onChange={(e) => setShowLowStock(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Stock Bajo</span>
          </label>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredProducts.length} de {initialProducts.length} productos
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={() => handleEdit(product)}
            onDelete={() => handleDelete(product.id)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-lg">No se encontraron productos</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
            </div>
            <div className="p-6">
              <ProductForm
                categories={categories}
                brands={brands}
                initialData={editingProduct ? {
                  id: editingProduct.id,
                  nombre: editingProduct.nombre,
                  codigo: editingProduct.codigo,
                  categoriaId: categories.find(c => c.nombre === editingProduct.categoria)?.id || 0,
                  marcaId: brands.find(b => b.nombre === editingProduct.marca)?.id || 0,
                  precio: editingProduct.precio,
                  stock: editingProduct.stock,
                  imagenUrl: editingProduct.imagenUrl,
                } : undefined}
                onSuccess={handleSuccess}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
