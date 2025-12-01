'use client';

import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, FolderOpen, AlertCircle } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from '@/actions/category-actions';
import { Category } from '@/actions/get-categories';
import { Badge } from '@/components/ui/Badge';

interface CategoriesClientProps {
  initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  // Estados
  const [categories, setCategories] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lógica de Filtrado
  const filteredCategories = categories.filter(cat => 
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGICA DE ACCIONES ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get('nombre') as string;

    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      setLoading(false);
      return;
    }

    const result = editingCategory
      ? await updateCategory(editingCategory.id, nombre)
      : await createCategory(nombre);

    if (result.success) {
      setShowForm(false);
      setEditingCategory(null);
      (e.target as HTMLFormElement).reset();
      window.location.reload(); 
    } else {
      setError(result.error || 'Error al guardar');
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    setLoading(true);
    const result = await deleteCategory(id);
    if (!result.success) alert(result.error);
    else window.location.reload();
    setLoading(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categorías</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona las familias de productos de tu tienda
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md text-sm"
        >
          <Plus className="w-4 h-4" />
          Nueva Categoría
        </button>
      </div>

      {/* 2. MAIN CARD AREA */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Formulario Inline */}
        {showForm && (
          <div className="bg-blue-50/50 border-b border-blue-100 p-6 animate-in slide-in-from-top-2">
            <div className="max-w-lg">
              <div className="flex items-center gap-2 mb-4 text-blue-700">
                <FolderOpen className="w-5 h-5" />
                <h3 className="font-semibold">{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de la categoría</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    autoFocus
                    placeholder="Ej. Juguetes de construcción"
                    defaultValue={editingCategory?.nombre}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
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
              placeholder="Buscar categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Tabla Limpia (Sin Descripción ni Estado) */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-[100px]">ID</th>
                <th className="px-6 py-4">NOMBRE</th>
                <th className="px-6 py-4">PRODUCTOS</th>
                <th className="px-6 py-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">#{category.id}</td>
                    
                    {/* Nombre más grande para compensar el espacio */}
                    <td className="px-6 py-4 text-gray-900 font-medium text-base">
                        {category.nombre}
                    </td>
                    
                    <td className="px-6 py-4">
                       <Badge variant="outline" className={`
                            ${category.countProductos > 0 
                                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                : 'bg-gray-50 text-gray-500 border-gray-200'}
                       `}>
                         {category.countProductos} items
                       </Badge>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(category)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Eliminar"
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
                        <FolderOpen className="w-8 h-8 text-gray-300" />
                        <p>No se encontraron categorías</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 text-sm text-gray-500 bg-gray-50/30">
            Mostrando {filteredCategories.length} categorías
        </div>

      </div>
    </div>
  );
}