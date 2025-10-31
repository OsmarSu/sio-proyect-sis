'use client';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/ui/HeroSection';
import FeatureCard from '../components/ui/FeatureCard';
import ProductShowcase from '../components/ui/ProductShowcase';
import TestimonialCard from '../components/ui/TestimonialCard';

export default function LandingPage() {
  // Datos mock para la landing
  const featuredProducts = [
    {
      id: 1,
      name: 'Lego Classic',
      price: 29.99,
      image: '/api/placeholder/300/300',
      category: 'Construcción',
      isNew: true
    },
    {
      id: 2,
      name: 'Muñeca Barbie',
      price: 89.99,
      image: '/api/placeholder/300/300',
      category: 'Muñecas'
    },
    {
      id: 3,
      name: 'Pista Hot Wheels',
      price: 45.99,
      image: '/api/placeholder/300/300',
      category: 'Vehículos'
    },
    {
      id: 4,
      name: 'Set de Química',
      price: 34.99,
      image: '/api/placeholder/300/300',
      category: 'Educativos',
      isNew: true
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Madre de familia',
      content: 'Los juguetes educativos han sido fantasticos para el desarrollo de mis hijos. Calidad excelente!',
      avatar: '/api/placeholder/100/100',
      rating: 5
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Educador',
      content: 'Recomiendo esta juguetería por su enfoque en juguetes que realmente educan y divierten.',
      avatar: '/api/placeholder/100/100',
      rating: 4
    },
    {
      name: 'Ana Martínez',
      role: 'Psicóloga infantil',
      content: 'La variedad de juguetes para diferentes edades y necesidades es impresionante.',
      avatar: '/api/placeholder/100/100',
      rating: 5
    }
  ];

  const handleExploreProducts = () => {
    window.location.href = '/cliente/catalogo';
  };

  const handleViewAllProducts = () => {
    window.location.href = '/cliente/catalogo';
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="md:mt-16"> {/* Ajuste de margen para el header fijo */}
        {/* Hero Section */}
        <HeroSection
          title="Descubre la Magia del Juego"
          subtitle="Los mejores juguetes educativos y divertidos para todas las edades"
          primaryButtonText="Explorar Catálogo"
          secondaryButtonText="Ver Ofertas"
          onPrimaryClick={handleExploreProducts}
          onSecondaryClick={handleExploreProducts}
        />

        {/* Features Section */}
        <section id="nosotros" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">¿Por Qué Elegirnos?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ofrecemos juguetes de calidad que inspiran creatividad y aprendizaje
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon="🎯"
                title="Calidad Garantizada"
                description="Todos nuestros juguetes pasan por rigurosos controles de calidad y seguridad"
                color="blue"
              />
              <FeatureCard
                icon="🚚"
                title="Envío Rápido"
                description="Recibe tus juguetes en 24-48 horas con nuestro servicio de envío express"
                color="green"
              />
              <FeatureCard
                icon="💝"
                title="Asesoramiento Expertos"
                description="Nuestro equipo te ayuda a elegir el juguete perfecto para cada edad"
                color="purple"
              />
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <ProductShowcase
          title="Productos Destacados"
          subtitle="Los juguetes más populares y nuevos de nuestra colección"
          products={featuredProducts}
          onViewAll={handleViewAllProducts}
        />

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Lo Que Dicen Nuestros Clientes</h2>
              <p className="text-xl text-gray-600">Experiencias reales de familias felices</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Listo para Descubrir Juguetes Increíbles?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Explora nuestro catálogo completo y encuentra el juguete perfecto
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleExploreProducts}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-300 transform hover:scale-105"
              >
                Ver Catálogo Completo
              </button>
              <button
                onClick={() => window.location.href = '#contacto'}
                className="bg-transparent hover:bg-blue-700 text-white border-2 border-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300"
              >
                Contactarnos
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}