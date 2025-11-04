import Badge from "@/components/ui/Badge";
import React from "react";

export interface Product {
  name: string;
  code: string;
  category: string;
  currentStock: number;
  minStock: number;
  majorPrice: number;
  minorPrice: number;
  provider: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const isLowStock = product.currentStock < product.minStock;
  const stockStatus = isLowStock ? "Bajo" : "Normal";
  const stockStatusVariant = isLowStock ? "danger" : "success";

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 hover:shadow-md transition-shadow">
      {/* Información principal del producto */}
      <div className="md:col-span-4 flex flex-col gap-2 items-start">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
          <Badge>{product.code}</Badge>
        </div>
        <Badge variant="primary">{product.category}</Badge>
      </div>

      {/* Detalles del producto */}
      <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Stock Actual</p>
          <p className="font-semibold text-gray-900">{product.currentStock} unidades</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Stock Mínimo</p>
          <p className="font-semibold text-gray-900">{product.minStock} unidades</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Precio Mayorista</p>
          <p className="font-semibold text-gray-900">Bs. {product.majorPrice}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Proveedor</p>
          <p className="font-semibold text-gray-900">{product.provider}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Precio Minorista</p>
          <p className="font-semibold text-gray-900">Bs. {product.minorPrice}</p>
        </div>
      </div>
      
      {/* Estado del stock */}
      <div className="md:col-span-1 flex justify-start md:justify-end">
        <Badge variant={stockStatusVariant}>{stockStatus}</Badge>
      </div>
    </div>
  );
};

export default ProductCard;