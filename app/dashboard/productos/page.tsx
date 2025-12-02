import { getProducts } from '@/actions/get-products';
import { getCategories } from '@/actions/get-categories';
import { getBrands } from '@/actions/get-brands';
import { ProductsGrid } from '@/components/products/products-grid';
import Button from '@/components/ui/Button';
import PlusIcon from '@/components/icons/PlusIcon';

export const dynamic = 'force-dynamic';

export default async function ProductosPage() {
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Productos</h1>
              <p className="text-gray-600 text-base">
                Administra el inventario, precios y disponibilidad de tus productos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <ProductsGrid 
        initialProducts={products} 
        categories={categories}
        brands={brands}
      />
    </div>
  );
}