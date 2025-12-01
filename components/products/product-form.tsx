'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, ImageIcon, Hash, DollarSign, Package, Trash } from 'lucide-react';
import { createProduct, updateProduct, deleteProduct } from '@/actions/product-actions'; // Asegúrate de tener estas funciones
import { Category } from '@/actions/get-categories';
import { Brand } from '@/actions/get-brands';
import ImageUpload from '@/components/ui/image-upload';

// Tipamos los datos que vienen de la DB para edición
// (Puede que necesites ajustar esto según lo que devuelva tu 'getProductById')
interface ProductData {
  id: number;
  nombre: string;
  codigo: string;
  precio: number;
  stock: number;
  categoriaId: number;
  marcaId: number;
  imagenUrl: string;
}

interface ProductFormProps {
  categories: Category[];
  brands: Brand[];
  initialData?: ProductData | null; // ✅ Nuevo: Datos opcionales para editar
}

export function ProductForm({ categories, brands, initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // ✅ Inicializamos el estado con los datos existentes (si hay) o vacío
  const [imageUrl, setImageUrl] = useState(initialData?.imagenUrl || ''); 

  // Título y Acción dinámica
  const title = initialData ? 'Editar Producto' : 'Crear Producto';
  const description = initialData ? 'Modifica los detalles del producto.' : 'Agrega un nuevo producto al inventario.';
  const action = initialData ? 'Guardar Cambios' : 'Crear Producto';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    let result;
    
    if (initialData) {
      result = await updateProduct(initialData.id, formData);
    } else {
      result = await createProduct(formData);
    }

    if (result.success) {
      window.location.href = '/dashboard/productos';
    } else {
      setError(result.error || 'Algo salió mal.');
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!initialData) return;
    if (!confirm('¿Estás seguro? Esta acción no se puede deshacer.')) return;
    
    setLoading(true);
    const result = await deleteProduct(initialData.id);
    
    if (result.success) {
        router.push('/dashboard/productos');
        router.refresh();
    } else {
        setError(result.error || 'Error al eliminar');
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera del Formulario con Botón de Eliminar */}
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        {initialData && (
            <button
                type="button"
                disabled={loading}
                onClick={onDelete}
                className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                title="Eliminar Producto"
            >
                <Trash className="w-5 h-5" />
            </button>
        )}
      </div>

      <div className="h-px bg-gray-200" />

      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 border border-red-200">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información General</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                          <input 
                            name="nombre" 
                            required 
                            defaultValue={initialData?.nombre} // ✅ Pre-fill
                            placeholder="Ej. Set de Lego" 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>
                      <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Hash className="w-3 h-3"/> Código</label>
                          <input 
                            name="codigo" 
                            required 
                            defaultValue={initialData?.codigo} // ✅ Pre-fill
                            placeholder="SKU-123" 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" 
                          />
                      </div>
                       <div className="hidden md:block"></div> 
                       
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                          <select 
                            name="categoriaId" 
                            required 
                            defaultValue={initialData?.categoriaId} // ✅ Pre-fill
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          >
                          <option value="">Seleccionar...</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                          <select 
                            name="marcaId" 
                            required 
                            defaultValue={initialData?.marcaId} // ✅ Pre-fill
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          >
                          <option value="">Seleccionar...</option>
                          {brands.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
                          </select>
                      </div>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                   <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Inventario</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3"/> Precio</label>
                          <input 
                            name="precio" 
                            type="number" 
                            step="0.01" 
                            required 
                            defaultValue={initialData?.precio} // ✅ Pre-fill
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Package className="w-3 h-3"/> Stock Actual</label>
                          <input 
                            name="stock" 
                            type="number" 
                            required 
                            defaultValue={initialData?.stock} // ✅ Pre-fill
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>
                   </div>
              </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="lg:col-span-1">
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-gray-500" /> Multimedia
                  </h3>
                  
                  <ImageUpload 
                      value={imageUrl ? [imageUrl] : []} 
                      disabled={loading}
                      onChange={(url) => setImageUrl(url)}
                      onRemove={() => setImageUrl('')}
                  />
                  
                  <input type="hidden" name="imagenUrl" value={imageUrl} />
               </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            {loading ? 'Guardando...' : <><Save className="w-4 h-4" /> {action}</>}
          </button>
        </div>

      </form>
    </div>
  );
}