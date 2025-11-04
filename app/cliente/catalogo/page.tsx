'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import SearchBar from '@/components/ui/SearchBar';
import FilterSidebar from '@/components/ui/FilterSidebar';
import { Product, FilterOptions } from './types/product';

// Datos mock de productos
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
  {
    id: 3,
    name: 'Hot Wheels Pista Extrema',
    price: 45.99,
    category: 'Vehículos',
    ageRange: '6-8 años',
    image: '/api/placeholder/300/300',
    description: 'Pista de carreras con loops y saltos increíbles',
    stock: 12,
    rating: 4.7
  },
  {
    id: 4,
    name: 'Monopoly Edición Boliviana',
    price: 39.99,
    category: 'Juegos de Mesa',
    ageRange: '9-12 años',
    image: '/api/placeholder/300/300',
    description: 'El clásico juego de mesa con calles y lugares de Bolivia',
    stock: 20,
    rating: 4.6
  },
  {
    id: 5,
    name: 'Set de Química Explosiva',
    price: 54.99,
    category: 'Educativos',
    ageRange: '9-12 años',
    image: '/api/placeholder/300/300',
    description: 'Kit completo de experimentos científicos seguros y divertidos',
    stock: 7,
    rating: 4.9,
    isNew: true
  },
  {
    id: 6,
    name: 'Pelota de Fútbol Profesional',
    price: 34.99,
    category: 'Deportes',
    ageRange: '6-8 años',
    image: '/api/placeholder/300/300',
    description: 'Pelota de fútbol oficial tamaño 5 con diseño exclusivo',
    stock: 25,
    rating: 4.4
  }
];

export default function CatalogoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    ageRange: '',
    priceRange: { min: 0, max: 1000 },
    sortBy: 'name'
  });

  // Filtrar y ordenar productos
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
    <div className="min-h-screen bg-gray-50">
      {/* Header del catálogo */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Catálogo de Juguetes</h1>
            <p className="text-lg text-gray-600 mb-6">
              Descubre los mejores juguetes para todas las edades
            </p>
            
            {/* Barra de búsqueda */}
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros */}
          <aside className="lg:w-1/4">
            <div className="sticky top-4">
              <FilterSidebar filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Grid de productos */}
          <main className="lg:w-3/4">
            {/* Barra de resultados */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-semibold text-lg">
                  {filteredProducts.length}
                </span>
                <span className="text-gray-600">
                  producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Selector de ordenamiento rápido */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Ordenar por:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Nombre</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                  <option value="rating">Mejor Valorados</option>
                  <option value="newest">Más Nuevos</option>
                </select>
              </div>
            </div>

            {/* Grid de productos */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-600">
                    Intenta ajustar los filtros o buscar con otros términos
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({
                        category: '',
                        ageRange: '',
                        priceRange: { min: 0, max: 1000 },
                        sortBy: 'name'
                      });
                    }}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

            {/* Paginación (opcional para futuro) */}
            {filteredProducts.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    Anterior
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}