// app/page.tsx

import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/ui/HeroSection';
import FeatureCard from '../components/ui/FeatureCard';
import ProductShowcase from '../components/ui/ProductShowcase';
import TestimonialCard from '../components/ui/TestimonialCard';
import { prisma } from '../lib/prisma'; // ¡CAMBIO IMPORTANTE AQUÍ! Usamos llaves {}
import { Product } from '@prisma/client';

export default async function LandingPage() {
  const latestProducts = await prisma.product.findMany({
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const featuredProducts = latestProducts.map((product: Product) => ({
  // Ya no usamos "...product". Seleccionamos SOLO las propiedades que necesitamos.
  id: product.id,
  name: product.name,
  price: product.price.toNumber(),
  image: product.imageUrl || '/images/placeholder.png', // Renombramos imageUrl a image
  category: product.category || undefined, // Incluimos la categoría
}));

  const testimonials = [
    { name: 'María González', role: 'Madre de familia', content: 'Calidad excelente!', avatar: '/api/placeholder/100/100', rating: 5 },
    { name: 'Carlos Rodríguez', role: 'Educador', content: 'Juguetes que educan y divierten.', avatar: '/api/placeholder/100/100', rating: 4 },
    { name: 'Ana Martínez', role: 'Psicóloga infantil', content: 'La variedad es impresionante.', avatar: '/api/placeholder/100/100', rating: 5 },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="md:mt-16">
        <HeroSection
          title="Descubre la Magia del Juego"
          subtitle="Los mejores juguetes para todas las edades"
          primaryButtonText="Explorar Catálogo"
          secondaryButtonText="Ver Ofertas"
          primaryButtonHref="/cliente/catalogo"
          secondaryButtonHref="/cliente/ofertas"
        />

        <section id="nosotros" className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">¿Por Qué Elegirnos?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <FeatureCard icon="🎯" title="Calidad Garantizada" description="Juguetes seguros y duraderos" color="blue" />
              <FeatureCard icon="🚚" title="Envío Rápido" description="Recibe tus juguetes en 24-48 horas" color="green" />
              <FeatureCard icon="💝" title="Asesoramiento Experto" description="Te ayudamos a elegir el juguete perfecto" color="purple" />
            </div>
          </div>
        </section>

        <ProductShowcase
          title="Productos Destacados"
          subtitle="Nuestra colección más popular y nueva"
          products={featuredProducts}
          viewAllHref="/cliente/catalogo"
        />

        <section className="py-16 bg-white">
           <div className="container mx-auto px-4 text-center">
             <h2 className="text-4xl font-bold text-gray-800 mb-4">Lo Que Dicen Nuestros Clientes</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
               {testimonials.map((testimonial, index) => (
                 <TestimonialCard key={index} {...testimonial} />
               ))}
             </div>
           </div>
        </section>

        <section className="py-16 bg-blue-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">¿Listo para Descubrir Juguetes Increíbles?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/cliente/catalogo" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold">
                Ver Catálogo Completo
              </Link>
              <Link href="#contacto" className="bg-transparent hover:bg-blue-700 text-white border-2 border-white px-8 py-3 rounded-lg text-lg font-semibold">
                Contactarnos
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}