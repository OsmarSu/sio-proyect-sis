'use client';

import { FilterOptions } from "@/app/cliente/catalogo/types/product";

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const categories = [
  'Todos',
  'Educativos',
  'Muñecas',
  'Vehiculos',
  'Construcción',
  'Juegos de Mesa',
  'Peluches',
  'Exteriores'
];

const ageRanges = [
  'Todas las edades',
  '0-2 años',
  '3-5 años',
  '6-8 años',
  '9-12 años',
  '13+ años'
];

const sortOptions = [
  { value: 'name', label: 'Nombre A-Z' },
  { value: 'price-low', label: 'Precio: Menor a Mayor' },
  { value: 'price-high', label: 'Precio: Mayor a Menor' },
  { value: 'rating', label: 'Mejor Valorados' },
  { value: 'newest', label: 'Más Nuevos' }
];

export default function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category === 'Todos' ? '' : category
    });
  };

  const handleAgeRangeChange = (ageRange: string) => {
    onFiltersChange({
      ...filters,
      ageRange: ageRange === 'Todas las edades' ? '' : ageRange
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-semibold text-lg mb-4">Filtrar por</h3>
      
      {/* Categorías */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Categorías</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={filters.category === (category === 'Todos' ? '' : category)}
                onChange={() => handleCategoryChange(category)}
                className="mr-2"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rango de Edad */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Edad</h4>
        <div className="space-y-2">
          {ageRanges.map((ageRange) => (
            <label key={ageRange} className="flex items-center">
              <input
                type="radio"
                name="ageRange"
                checked={filters.ageRange === (ageRange === 'Todas las edades' ? '' : ageRange)}
                onChange={() => handleAgeRangeChange(ageRange)}
                className="mr-2"
              />
              <span>{ageRange}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ordenar por */}
      <div>
        <h4 className="font-medium mb-3">Ordenar por</h4>
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}