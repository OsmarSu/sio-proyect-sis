// app/dashboard/productos/ProductsClient.tsx
"use client";
import { createProductAction } from "@/app/actions/product-actions";
import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import ProductCard from "./components/ProductCard"; // Asegúrate de tener este componente
import ProductModal from "./components/ProductModal"; // Asegúrate de tener este componente
import { Product, ProductFormData } from "./types";

interface ProductsClientProps {
  initialProducts: Product[]; // <--- Aquí recibimos los datos de la BD
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  // Inicializamos el estado con los datos reales que vienen del servidor
  const [products, setProducts] = useState<Product[]>(initialProducts);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);

  // Lógica de filtrado (Mantenemos tu lógica, es excelente)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !categoryFilter || product.category === categoryFilter;
      const matchesStock =
        !showLowStock || product.currentStock <= product.minStock;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, categoryFilter, showLowStock]);

  // Extraer categorías dinámicamente de los productos reales
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // NOTA: Esto solo borra visualmente. Para borrar en BD necesitaremos una Server Action después.
  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto visualmente?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // NOTA: Esto solo guarda visualmente.
 const handleSave = async (data: ProductFormData) => {
    
    // CASO 1: EDITAR (Aún no implementado en backend, lo dejamos visual)
    if (editingProduct) {
      const updatedProduct: Product = {
        ...editingProduct,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
      );
      setIsModalOpen(false);
      setEditingProduct(null);
      return; 
    }

    // CASO 2: CREAR NUEVO (Conectado a Supabase)
    try {
      // 1. Llamamos a la Server Action
      const result = await createProductAction(data);

      if (result.success) {
        // 2. Si todo salió bien, cerramos el modal.
        // NO necesitamos actualizar 'setProducts' manualmente porque
        // revalidatePath del servidor refrescará la página automáticamente.
        setIsModalOpen(false);
        setEditingProduct(null);
        alert("Producto creado exitosamente en la Nube");
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error inesperado");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestión de Productos
          </h1>
          <p className="text-slate-500 text-sm">
            Inventario activo: {products.length} items
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm font-medium transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 outline-none"
        >
          <option value="">Todas las Categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 select-none">
          <input
            type="checkbox"
            checked={showLowStock}
            onChange={(e) => setShowLowStock(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-600">Stock Bajo</span>
        </label>
      </div>

      {/* GRID DE TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* MODAL */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        productoEditar={editingProduct}
      />
    </div>
  );
}