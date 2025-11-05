'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import SearchBar from '@/components/ui/SearchBar';
import FilterSidebar from '@/components/ui/FilterSidebar';
import { Product, FilterOptions } from './types/product';

// Datos mock de productos con imágenes
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Lego Classic - Caja Creativa',
    price: 229.99,
    originalPrice: 279.99,
    category: 'Construcción',
    ageRange: '6-8 años',
    image: 'https://www.lego.com/cdn/cs/set/assets/blt10888b5e58f4fa76/3_11029_Classic_Sidekick_tall.jpg?fit=crop&format=jpg&quality=80&width=800&height=600&dpr=1',
    description: 'Set de construcción creativa con piezas coloridas para horas de diversión',
    stock: 15,
    rating: 4.8,
    isNew: true,
    isOnSale: true
  },
  {
    id: 2,
    name: 'Muñeca Barbie Dreamhouse',
    price: 689.99,
    category: 'Muñecas',
    ageRange: '3-5 años',
    image: 'https://toysmart.co/cdn/shop/products/01605-1_720x.jpg?v=1707227997',
    description: 'Casa de sueños con accesorios y muebles para muñecas Barbie',
    stock: 8,
    rating: 4.5
  },
  {
    id: 3,
    name: 'Hot Wheels Pista Extrema',
    price: 345.99,
    category: 'Vehículos',
    ageRange: '6-8 años',
    image: 'https://http2.mlstatic.com/D_NQ_NP_670063-MLA89683253713_082025-O.webp',
    description: 'Pista de carreras con loops y saltos increíbles',
    stock: 12,
    rating: 4.7
  },
  {
    id: 4,
    name: 'Monopoly',
    price: 299.99,
    category: 'Juegos de Mesa',
    ageRange: '9-12 años',
    image: 'https://production-tailoy-repo-magento-statics.s3.amazonaws.com/imagenes/872x872/productos/i/j/u/juego-de-mesa-hasbro-gaming-monopoly-decodificador-49409-default-1.jpg',
    description: 'El clásico juego de mesa con calles y lugares de Bolivia',
    stock: 20,
    rating: 4.6
  },
  {
    id: 5,
    name: 'Kit de juguetes de Doctor',
    price: 419.99,
    category: 'Educativos',
    ageRange: '9-12 años',
    image: 'https://m.media-amazon.com/images/I/71XswLSDL0L._AC_UF894,1000_QL80_.jpg',
    description: 'Kit completo de vestimenta y accesorios de doctor',
    stock: 7,
    rating: 4.9,
    isNew: true
  },
  {
    id: 6,
    name: 'Pelota de Fútbol',
    price: 269.99,
    category: 'Deportes',
    ageRange: '6-8 años',
    image: 'https://www.mijugueteria.com.ec/wp-content/uploads/2023/11/40494985_0120230215120125.jpg',
    description: 'Pelota de fútbol oficial tamaño 5 con diseño exclusivo',
    stock: 25,
    rating: 4.4
  },
  {
    id: 7,
    name: 'Puzzle 3D Torre Eiffel',
    price: 189.99,
    category: 'Juegos de Mesa',
    ageRange: '9-12 años',
    image: 'https://images-rajhraciek-cdn.rshop.sk/lgt/products/0f0f4fc62d686f9a91c96dd74b04bce0.jpg',
    description: 'Rompecabezas tridimensional de 500 piezas',
    stock: 18,
    rating: 4.7,
    isNew: true
  },
  {
    id: 8,
    name: 'Pistola de Hidrogel',
    price: 599.99,
    originalPrice: 699.99,
    category: 'Educativos',
    ageRange: '9-12 años',
    image: 'https://realplaza.vtexassets.com/arquivos/ids/31036721-800-auto?v=638048181715970000&width=800&height=auto&aspect=true',
    description: 'Pistola de Hidrogel para jugar',
    stock: 5,
    rating: 4.9,
    isOnSale: true
  },
  {
    id: 9,
    name: 'Set de Dinosaurios Jurásicos',
    price: 150.99,
    category: 'Exteriores',
    ageRange: '3-5 años',
    image: 'https://todojuguete.es/191924/set_6_dinosaurios_con_arboles_jurassic_era.jpg',
    description: 'Colección de 12 dinosaurios realistas para aventuras prehistóricas',
    stock: 30,
    rating: 4.6
  },
  {
    id: 10,
    name: 'Castillo de Princesas',
    price: 449.99,
    category: 'Muñecas',
    ageRange: '3-5 años',
    image: 'https://www.startoys.ar/files/product_image/image/53/181062/thumb_3422_9675_1.jpg',
    description: 'Castillo mágico con luces y sonidos, incluye 3 princesas',
    stock: 10,
    rating: 4.8,
    isNew: true
  },
  {
    id: 11,
    name: 'Patines Infantiles', 
    price: 389.99,
    category: 'Deportes',
    ageRange: '9-12 años',
    image: 'https://denuevoo.com/wp-content/uploads/2023/08/patineta-rosada-roller.png',
    description: 'Skateboard con diseño exclusivo y rodamientos ABEC-7',
    stock: 14,
    rating: 4.5
  },
  {
    id: 12,
    name: 'Set de Arte Completo',
    price: 279.99,
    category: 'Educativos',
    ageRange: '6-8 años',
    image: 'https://i.ebayimg.com/thumbs/images/g/xP0AAOSw9e9oVkzN/s-l1200.jpg',
    description: 'Maletín con 150 piezas: lápices, acuarelas, marcadores y más',
    stock: 22,
    rating: 4.7,
    isOnSale: true,
    originalPrice: 329.99
  },
  {
    id: 13,
    name: 'Cocina de Juguete Deluxe',
    price: 519.99,
    category: 'Muñecas',
    ageRange: '3-5 años',
    image: 'https://image.made-in-china.com/202f0j00pWrbjgEnJfqL/Kindergarten-Kids-Role-Play-Game-Simulated-Kitchen-Utensils-Kitchenware-Tableware-Pots-Gas-Stove-Plastic-Cooking-Toys-for-Girls.webp',
    description: 'Cocina interactiva con luces, sonidos y accesorios',
    stock: 9,
    rating: 4.8
  },
  {
    id: 14,
    name: 'Dron con Cámara HD',
    price: 899.99,
    category: 'Vehículos',
    ageRange: '9-12 años',
    image: 'https://i5.walmartimages.com/asr/b06485a4-710e-412d-a263-ff41ac22ee58.e71b7ecc05fe12f4e17d38108054e037.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',
    description: 'Dron con cámara 1080p y control remoto, ideal para principiantes',
    stock: 6,
    rating: 4.9,
    isNew: true
  },
  {
    id: 15,
    name: 'Juego de Madera Jenga',
    price: 189.99,
    category: 'Juegos de Mesa',
    ageRange: '6-8 años',
    image: 'https://m.media-amazon.com/images/I/81yiXHwgQWL.jpg',
    description: 'Torre de bloques gigante de 60cm para diversión familiar',
    stock: 16,
    rating: 4.6
  }
];

export default function CatalogoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    ageRange: '',
    priceRange: { min: 0, max: 1000 },
    sortBy: 'name'
  });

  const itemsPerPage = 6;

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

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset a página 1 al buscar
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset a página 1 al cambiar filtros
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
              <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} />
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
              <span className="text-sm text-black font-medium">Ordenar por:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFiltersChange({ ...filters, sortBy: e.target.value })}
                className="px-3 py-2 border border-black rounded-lg text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {currentProducts.length === 0 ? (
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
                      setCurrentPage(1);
                    }}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentProducts.map((product) => (
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

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Anterior
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}