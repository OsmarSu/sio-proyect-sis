'use client';

import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, Tag, AlertCircle } from 'lucide-react';
// ⚠️ Asumo que tienes estas acciones creadas siguiendo el patrón de categorías
import { createBrand, updateBrand, deleteBrand } from '@/actions/brand-actions'; 
import { Brand } from '@/actions/get-brands';
import { Badge } from '@/components/ui/Badge';

interface BrandsClientProps {
  initialBrands: Brand[];
}

export function BrandsClient({ initialBrands }: BrandsClientProps) {
  // Estados
  const [brands, setBrands] = useState(initialBrands);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lógica de Filtrado (Solo por nombre)
  const filteredBrands = brands.filter(brand => 
    brand.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- HANDLERS (Similares a Categorías) ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get('nombre') as string;

    // Validación básica
    if (!nombre.trim()) {
        setError('El nombre de la marca es obligatorio');
        setLoading(false);
        return;
    }

    try {
        const result = editingBrand
        ? await updateBrand(editingBrand.id, nombre)
        : await createBrand(nombre);

        if (result.success) {
        setShowForm(false);
        setEditingBrand(null);
        (e.target as HTMLFormElement).reset();
        window.location.reload(); 
        } else {
        setError(result.error || 'Error al guardar');
        }
    } catch (err) {
        setError('Ocurrió un error inesperado');
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta marca?')) return;
    setLoading(true);
    const result = await deleteBrand(id);
    if (!result.success) alert(result.error);
    else window.location.reload();
    setLoading(false);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Marcas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra los fabricantes y marcas disponibles
          </p>
        </div>
        <button
          onClick={() => {
            setEditingBrand(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md text-sm"
        >
          <Plus className="w-4 h-4" />
          Nueva Marca
        </button>
      </div>

      {/* 2. MAIN CARD AREA */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Formulario Inline */}
        {showForm && (
          <div className="bg-indigo-50/30 border-b border-indigo-100 p-6 animate-in slide-in-from-top-2">
            <div className="max-w-lg">
              <div className="flex items-center gap-2 mb-4 text-indigo-700">
                <Tag className="w-5 h-5" />
                <h3 className="font-semibold">{editingBrand ? 'Editar Marca' : 'Registrar Nueva Marca'}</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de la Marca</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    autoFocus
                    placeholder="Ej. LEGO, Mattel, Hasbro..."
                    defaultValue={editingBrand?.nombre}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                   <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : 'Guardar Marca'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Barra de Filtros */}
        <div className="p-5 border-b border-gray-100 bg-white">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Tabla Real (Sin datos falsos) */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-[80px]">ID</th>
                <th className="px-6 py-4">MARCA</th>
                <th className="px-6 py-4">PRODUCTOS VINCULADOS</th>
                <th className="px-6 py-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">#{brand.id}</td>
                    
                    <td className="px-6 py-4 text-gray-900 font-medium text-base">
                        {/* Aumentamos un poco el tamaño de fuente aquí para dar jerarquía */}
                        {brand.nombre}
                    </td>

                    <td className="px-6 py-4">
                        {/* Badge condicional: Gris si es 0, Azul si tiene productos */}
                       <Badge variant="outline" className={`
                            ${brand.countProductos > 0 
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                                : 'bg-gray-50 text-gray-500 border-gray-200'}
                       `}>
                         {brand.countProductos} items
                       </Badge>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(brand)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Editar nombre"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(brand.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Eliminar marca"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                        <Tag className="w-8 h-8 text-gray-300" />
                        <p>No se encontraron marcas</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer simple */}
        <div className="px-6 py-4 border-t border-gray-100 text-sm text-gray-500 bg-gray-50/30">
            Mostrando {filteredBrands.length} marcas registradas
        </div>

      </div>
    </div>
  );
}