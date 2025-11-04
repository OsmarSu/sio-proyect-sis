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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h3 className="font-bold text-lg text-gray-900">Filtrar por</h3>
      </div>
      
      {/* Categorías */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Categorías</h4>
        <div className="space-y-2.5">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={filters.category === (category === 'Todos' ? '' : category)}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 group-hover:text-gray-900 text-sm font-medium">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rango de Edad */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Edad Recomendada</h4>
        <div className="space-y-2.5">
          {ageRanges.map((ageRange) => (
            <label key={ageRange} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="ageRange"
                checked={filters.ageRange === (ageRange === 'Todas las edades' ? '' : ageRange)}
                onChange={() => handleAgeRangeChange(ageRange)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 group-hover:text-gray-900 text-sm font-medium">
                {ageRange}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Ordenar por */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Ordenar por</h4>
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer hover:bg-gray-100"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value} className="text-gray-900 bg-white">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Botón Limpiar Filtros */}
      <button
        onClick={() => onFiltersChange({ category: '', ageRange: '', sortBy: 'name' })}
        className="mt-6 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
      >
        Limpiar Filtros
      </button>
    </div>
  );
}