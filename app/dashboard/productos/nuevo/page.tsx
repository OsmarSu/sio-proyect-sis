import { getCategories } from '@/actions/get-categories';
import { getBrands } from '@/actions/get-brands';
import { ProductForm } from '@/components/products/product-form';

export const dynamic = 'force-dynamic';

export default async function NuevoProductoPage() {
  // 1. Buscamos los datos para llenar los "Selects"
  // Usamos Promise.all para que sea más rápido (paralelo)
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands()
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Simple */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Producto</h1>
        <p className="text-gray-500">Completa la información para registrar un item en el inventario.</p>
      </div>

      {/* Renderizamos el Formulario Cliente */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <ProductForm 
          categories={categories} 
          brands={brands} 
        />
      </div>
    </div>
  );
}