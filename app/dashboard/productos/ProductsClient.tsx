// app/dashboard/productos/ProductsClient.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import { Product, ProductFormData } from "./types";
import { useRouter } from "next/navigation";
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/app/actions/product-actions";

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const router = useRouter();

  // Estado local
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);

  // Sincronización con el servidor
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // 🔍 LÓGICA DE FILTRADO CORREGIDA (Sin campos fantasma)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Búsqueda: Por Nombre o por ID (ya no hay CODE/SKU)
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toString().includes(searchTerm); // Buscamos por ID numérico

      // 2. Categoría
      const matchesCategory =
        !categoryFilter || product.category === categoryFilter;

      // 3. Stock Bajo: Como no tenemos 'minStock' en la DB,
      // usaremos un umbral fijo (ej: 5) o verificamos si es 0.
      const UMBRAL_STOCK_BAJO = 5;
      const matchesStock =
        !showLowStock || product.stockActual <= UMBRAL_STOCK_BAJO;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, categoryFilter, showLowStock]);

  // Extraer categorías únicas
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

  // 🗑️ DELETE: ID ahora es number
  const handleDelete = async (id: number) => {
    if (
      !confirm("¿Estás seguro de eliminar este producto de la Base de Datos?")
    )
      return;

    try {
      const result = await deleteProductAction(id);

      if (result.success) {
        alert("Producto eliminado correctamente");
        router.refresh(); // Forzamos recarga para asegurar sincronía
      } else {
        alert("Error al eliminar: " + result.error);
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  // 💾 SAVE: Crear y Editar
  const handleSave = async (data: ProductFormData) => {
    setIsSaving(true);

    try {
      let result;

      if (editingProduct) {
        // ID es number
        result = await updateProductAction(editingProduct.id, data);
      } else {
        result = await createProductAction(data);
      }

      if (result.success) {
        setIsModalOpen(false);
        setEditingProduct(null);
        router.refresh();
        // Feedback sutil
        // alert(editingProduct ? "Producto actualizado" : "Producto creado");
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error inesperado en el servidor");
    } finally {
      setIsSaving(false);
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
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm font-medium transition-colors disabled:opacity-50"
        >
          <Plus size={20} />
          <span>{isSaving ? "Guardando..." : "Nuevo Producto"}</span>
        </button>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o ID..." // Texto actualizado
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
          <span className="text-sm font-medium text-slate-600">
            Stock Bajo (&lt; 5)
          </span>
        </label>
      </div>

      {/* GRID DE TARJETAS */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p>No hay productos registrados aún.</p>
        </div>
      ) : (
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
      )}

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
