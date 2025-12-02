// app/dashboard/precios/hooks/usePrices.ts
import { useState, useMemo } from 'react';
import { mockProducts } from '@/lib/data/mockProducts'; // Tu data base
import { PricedProduct, MassUpdateConfig, PriceField } from '../types';
import { Product } from '../../productos/types';

export const usePrices = () => {
  // Inicializamos data mockeada con floorPrice
  const [products, setProducts] = useState<PricedProduct[]>(() => 
    (mockProducts as unknown as Product[]).map(p => ({
      ...p,
      floorPrice: Math.floor(p.majorPrice * 0.9), // Ejemplo: Floor es 90% del mayorista
      lastUpdate: new Date().toLocaleDateString()
    }))
  );

  // Estados de Filtros para la pestaña "Lista"
  const [filters, setFilters] = useState({ search: '', category: '' });

  // 1. Update Individual
  const updateSinglePrice = (id: string, newPrices: { minorPrice: number, majorPrice: number, floorPrice: number }) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, ...newPrices, lastUpdate: new Date().toLocaleDateString() } : p
    ));
  };

  // 2. Update Masivo
  const applyMassUpdate = (config: MassUpdateConfig) => {
    setProducts(prev => prev.map(p => {
      // Filtrar por categoría
      if (config.category !== 'Todas' && p.category !== config.category) return p;

      const currentPrice = p[config.field];
      let adjustment = 0;

      if (config.type === 'percentage') {
        adjustment = currentPrice * (config.value / 100);
      } else {
        adjustment = config.value; // Ya viene en Bs
      }

      const newPrice = Number((currentPrice + adjustment).toFixed(2));

      return {
        ...p,
        [config.field]: newPrice,
        lastUpdate: new Date().toLocaleDateString()
      };
    }));
  };

  // Productos filtrados para la lista
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                          p.code.toLowerCase().includes(filters.search.toLowerCase());
      const matchCat = filters.category === '' || filters.category === 'Todas' || p.category === filters.category;
      return matchSearch && matchCat;
    });
  }, [products, filters]);

  const categories = Array.from(new Set(products.map(p => p.category)));

  return {
    products: filteredProducts,
    allProducts: products, // Para conteos
    categories,
    filters,
    setFilters,
    updateSinglePrice,
    applyMassUpdate
  };
};