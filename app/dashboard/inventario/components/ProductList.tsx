import React from 'react';
import ProductCard, { Product } from './ProductCard'; 
const mockProducts: Product[] = [
  {
    name: 'Carro de Control Remoto',
    code: 'P001',
    category: 'Juguetes Electrónicos',
    currentStock: 15,
    minStock: 10,
    majorPrice: 120,
    minorPrice: 180,
    provider: 'Importadora Toys',
  },
  {
    name: 'Muñeca Barbie',
    code: 'P002',
    category: 'Muñecas',
    currentStock: 25,
    minStock: 15,
    majorPrice: 80,
    minorPrice: 120,
    provider: 'Mattel Bolivia',
  },
  {
    name: 'Lego City',
    code: 'P003',
    category: 'Construcción',
    currentStock: 8,
    minStock: 15,
    majorPrice: 200,
    minorPrice: 300,
    provider: 'Lego Store',
  },
   {
    name: 'Pelota de Fútbol',
    code: 'P004',
    category: 'Deportes',
    currentStock: 30,
    minStock: 20,
    majorPrice: 50,
    minorPrice: 75,
    provider: 'Deportes Ltda',
  },
];



const ProductList = () => {
  return (
    <div className="space-y-4">
      {mockProducts.map((product) => (
        <ProductCard 
          key={product.code} 
          product={product} 
        />
      ))}
    </div>
  );
};

export default ProductList;