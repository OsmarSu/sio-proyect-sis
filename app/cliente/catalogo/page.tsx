// app/cliente/catalogo/page.tsx
'use client'; // <-- IMPORTANTE: Lo ponemos de vuelta al principio

import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import SearchBar from '@/components/ui/SearchBar';
import FilterSidebar from '@/components/ui/FilterSidebar';
import { Product, FilterOptions } from './types/product';

const handleAddToCart = (productId: number) => {
  // Permitir agregar al carrito sin login, pero mostrar mensaje si no está logueado
  
  // Lógica para agregar al carrito
};
// Datos mock de productos (igual que antes)
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Lego Classic - Caja Creativa',
    price: 29.99,
    originalPrice: 34.99,
    category: 'Construcción',
    ageRange: '6-8 años',
    image: '/api/placeholder/300/300',
    description: 'Set de construcción creativa con piezas coloridas para horas de diversión',
    stock: 15,
    rating: 4.8,
    isNew: true,
    isOnSale: true
  },
  {
    id: 2,
    name: 'Muñeca Barbie Dreamhouse',
    price: 89.99,
    category: 'Muñecas',
    ageRange: '3-5 años',
    image: '/api/placeholder/300/300',
    description: 'Casa de sueños con accesorios y muebles para muñecas Barbie',
    stock: 8,
    rating: 4.5
  },
  // ... (los demás productos igual)
];

export default function CatalogoPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Estado para guardar los productos
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    ageRange: '',
    priceRange: { min: 0, max: 1000 },
    sortBy: 'name'
  });

  // Filtrar y ordenar productos (la misma lógica)
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesAgeRange = !filters.ageRange || product.ageRange === filters.ageRange;
      
      return matchesSearch && matchesCategory && matchesAgeRange;
    });

    // Ordenar productos
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Catálogo de Juguetes</h1>
          <p className="text-lg text-gray-600 mb-8">
            Descubre los mejores juguetes para todas las edades
          </p>
          
          {/* Barra de búsqueda */}
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Contenido principal */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros */}
          <div className="lg:w-1/4">
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Grid de productos */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron productos que coincidan con tu búsqueda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    image={product.image}
                    originalPrice={product.originalPrice}
                    ageRange={product.ageRange}
                    rating={product.rating}
                    stock={product.stock}
                    isNew={product.isNew}
                    isOnSale={product.isOnSale}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}