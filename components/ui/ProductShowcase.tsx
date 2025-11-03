// components/ui/ProductShowcase.tsx
import Link from 'next/link';
import React from 'react';

// 1. Corregimos el tipo de 'id' a 'string'
interface Product {
  id: string; 
  name: string;
  price: number;
  image: string;
  category?: string; // Hacemos 'category' opcional para mayor flexibilidad
  isNew?: boolean;
}

// 2. Actualizamos las props del componente principal
interface ProductShowcaseProps {
  title: string;
  subtitle: string;
  products: Product[];
  viewAllHref?: string; // Añadimos la nueva prop para el enlace
}

export default function ProductShowcase({
  title,
  subtitle,
  products,
  viewAllHref, // Recibimos la nueva prop
}: ProductShowcaseProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            // Idealmente, este bloque sería su propio componente 'ProductCard.tsx',
            // pero por ahora funciona perfectamente aquí.
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Nuevo
                  </span>
                )}
              </div>
              <div className="p-4">
                {product.category && (
                    <span className="text-sm text-gray-500">{product.category}</span>
                )}
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-600">${product.price.toFixed(2)}</span>
                  {/* El botón "Ver más" debería ser un Link a la página de detalle del producto */}
                  <Link href={`/producto/${product.id}`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 3. Reemplazamos el botón por un Link si existe 'viewAllHref' */}
        {viewAllHref && (
          <div className="text-center">
            <Link
              href={viewAllHref}
              className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Ver todos los productos
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}