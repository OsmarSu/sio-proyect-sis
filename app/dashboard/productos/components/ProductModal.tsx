// app/dashboard/productos/components/ProductModal.tsx
"use client";
import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Product, ProductFormData } from "../types";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => void; // ¡Corregido!
  productoEditar: Product | null;
}

const initialFormData: ProductFormData = {
  code: "",
  name: "",
  description: "",
  category: "",
  supplier: "",
  currentStock: 0,
  minStock: 5,
  majorPrice: 0,
  minorPrice: 0,
  ageRange: "+3 años",
  isNew: true,
  isOffer: false,
};

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  productoEditar,
}: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  // Cargar datos al abrir (Editar vs Crear)
  useEffect(() => {
    if (isOpen) {
      if (productoEditar) {
        // Desestructuramos para quitar ID, fechas, etc.
        const { id, active, createdAt, updatedAt, ...rest } = productoEditar;
        setFormData(rest);
      } else {
        setFormData(initialFormData);
      }
    }
  }, [isOpen, productoEditar]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); // Enviamos solo los datos del formulario
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    // Manejo especial para números y checkboxes
    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">
            {productoEditar ? "Editar Producto" : "Nuevo Producto"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Fila 1: Identificación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Nombre</label>
                <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ej. Lego City"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">SKU / Código</label>
                <input
                type="text"
                name="code"
                required
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                placeholder="Ej. LEG-001"
                />
            </div>
          </div>

          {/* Fila 2: Categorización */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Categoría</label>
                <input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Proveedor</label>
                <input type="text" name="supplier" required value={formData.supplier} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Edad Recomendada</label>
                <select name="ageRange" value={formData.ageRange} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white">
                    <option>+3 años</option>
                    <option>6-12 años</option>
                    <option>+12 años</option>
                    <option>Coleccionista</option>
                </select>
             </div>
          </div>

          {/* Fila 3: Números (Precios y Stock) */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
             <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">P. Mayorista</label>
                <input type="number" name="majorPrice" value={formData.majorPrice} onChange={handleChange} className="w-full px-2 py-1 border border-slate-300 rounded" />
             </div>
             <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">P. Venta (PVP)</label>
                <input type="number" name="minorPrice" required value={formData.minorPrice} onChange={handleChange} className="w-full px-2 py-1 border border-slate-300 rounded font-bold text-slate-700" />
             </div>
             <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Stock Actual</label>
                <input type="number" name="currentStock" required value={formData.currentStock} onChange={handleChange} className="w-full px-2 py-1 border border-slate-300 rounded" />
             </div>
             <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Stock Mín.</label>
                <input type="number" name="minStock" required value={formData.minStock} onChange={handleChange} className="w-full px-2 py-1 border border-slate-300 rounded" />
             </div>
          </div>

          {/* Fila 4: Descripción y Checkboxes */}
          <div className="space-y-4">
            <textarea
                name="description"
                rows={2}
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción detallada del producto..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none"
            />
            
            <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm font-medium text-slate-700">Marcar como Nuevo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isOffer" checked={formData.isOffer} onChange={handleChange} className="w-4 h-4 text-rose-600 rounded" />
                    <span className="text-sm font-medium text-slate-700">Es Oferta</span>
                </label>
            </div>
          </div>

          {/* Footer Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2">
              <Save size={18} />
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}