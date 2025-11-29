// app/dashboard/productos/components/ProductCard.tsx
import React from "react";
import { 
  Edit2, 
  Trash2, 
  Box, 
  Tag, 
  AlertTriangle, 
  Layers, 
  Sparkles, 
  Percent 
} from "lucide-react"; // ¡Importaciones limpias!
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const isLowStock = product.currentStock <= product.minStock;
  
  // Mapeo de colores (Mantenemos tu lógica de diseño)
  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      "Construcción": "border-l-blue-500",
      "Muñecas": "border-l-pink-500",
      "Deportes": "border-l-orange-500",
      "Juegos de Mesa": "border-l-purple-500",
    };
    return map[cat] || "border-l-slate-400";
  };

  return (
    <div className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 ${getCategoryColor(product.category)} border-l-[6px] flex flex-col`}>
      
      {/* HEADER */}
      <div className="p-4 pb-2">
        <div className="flex justify-between items-start mb-2">
           <div className="flex flex-wrap gap-1">
             <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded border border-slate-200">
               {product.category}
             </span>
             {product.isNew && (
               <span className="flex items-center gap-1 px-2 py-0.5 bg-sky-100 text-sky-700 text-[10px] font-bold uppercase rounded border border-sky-200">
                 <Sparkles size={10} /> Nuevo
               </span>
             )}
             {product.isOffer && (
               <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase rounded border border-rose-200 animate-pulse">
                 <Percent size={10} /> Oferta
               </span>
             )}
           </div>
           
           {isLowStock && (
             <div className="text-amber-500" title="Stock Crítico">
               <AlertTriangle size={18} />
             </div>
           )}
        </div>

        <h3 className="font-bold text-slate-800 text-lg leading-tight line-clamp-1" title={product.name}>
          {product.name}
        </h3>
        
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <Layers size={12} /> {product.code}
          </span>
          <span className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
            {product.ageRange}
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="px-4 py-3 grid grid-cols-2 gap-4 border-t border-slate-100 bg-slate-50/50">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1 flex items-center gap-1">
            <Tag size={10} /> Precio
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-slate-500">Bs.</span>
            <span className={`text-xl font-bold ${product.isOffer ? 'text-rose-600' : 'text-slate-900'}`}>
              {product.minorPrice}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">May: Bs. {product.majorPrice}</p>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1 flex items-center justify-end gap-1">
            Stock <Box size={10} />
          </p>
          <div className={`text-xl font-bold ${isLowStock ? 'text-red-600' : 'text-emerald-600'}`}>
            {product.currentStock}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Min: {product.minStock}</p>
        </div>
      </div>

      {/* FOOTER & ACCIONES */}
      <div className="mt-auto px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-white rounded-b-lg">
        <div className="text-xs text-slate-500 truncate w-1/2" title={product.supplier}>
          {product.supplier}
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit(product)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            <Edit2 size={14} />
            Editar
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;