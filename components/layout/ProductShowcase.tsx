'use client';
import { Button } from '@/components/ui/ButtonCli';
import { ProductCard } from '@/components/ui/ProductCard';
import Link from 'next/link';

const featuredProducts = [
  {
    name: 'Osito de Peluche',
    description: 'Suave y adorable compañero',
    price: 24.99,
    emoji: '🧸'
  },
  {
    name: 'Coche de Carreras',
    description: 'Velocidad y diversión',
    price: 19.99,
    emoji: '🚗'
  },
  {
    name: 'Rompecabezas',
    description: 'Desafía tu mente',
    price: 15.99,
    emoji: '🧩'
  },
  {
    name: 'Set de Pintura',
    description: 'Libera tu creatividad',
    price: 29.99,
    emoji: '🎨'
  }
];

export const ProductShowcase = () => {
  return (
    <section id="catalogo" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Catálogo Destacado
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12">
          Una muestra de nuestros productos más populares
        </p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              description={product.description}
              price={product.price}
              emoji={product.emoji}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/cliente/catalogo">
            <Button size="lg">
              Ver Catálogo Completo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};