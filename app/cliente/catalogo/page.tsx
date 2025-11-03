// app/cliente/catalogo/page.tsx
'use client'; // <-- IMPORTANTE: Lo ponemos de vuelta al principio

import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import SearchBar from '@/components/ui/SearchBar';
import FilterSidebar from '@/components/ui/FilterSidebar';
import { Product, FilterOptions } from './types/product';
import Header from '@/components/layout/Header'; // Importamos Header y Footer
import Footer from '@/components/layout/Footer';

// Esta página será 'use client' para manejar los filtros y la búsqueda,
// pero obtendrá los datos desde una API.

export default function CatalogoPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Estado para guardar los productos
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    ageRange: '',
    priceRange: { min: 0, max: 1000 },
    sortBy: 'name'
  });

  // --- OBTENCIÓN DE DATOS DEL LADO DEL CLIENTE ---
  useEffect(() => {
    // Función para pedir los productos a nuestra propia API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Llamamos a la API de productos
        const data = await response.json();
        setAllProducts(data); // Guardamos los productos en el estado
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); // El array vacío [] significa que esto se ejecuta solo una vez, cuando la página carga.

  // --- LÓGICA DE FILTRADO (igual que antes) ---
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      // ... (puedes añadir más lógica de filtro aquí si quieres)
      return matchesSearch;
    });

    return filtered;
  }, [searchQuery, filters, allProducts]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Catálogo de Juguetes</h1>
            <p className="text-lg text-gray-600 mb-8">
              Descubre los mejores juguetes para todas las edades
            </p>
            <SearchBar onSearch={setSearchQuery} />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <FilterSidebar filters={filters} onFiltersChange={setFilters} />
            </div>

            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  {filteredProducts.length} producto(s) encontrado(s)
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Cargando productos o no se encontraron coincidencias...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}