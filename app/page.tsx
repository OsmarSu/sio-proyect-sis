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
      content: 'Los juguetes educativos han sido fantásticos para el desarrollo de mis hijos. Calidad excelente!',
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

            {/* Visión y Misión */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              {/* Visión */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">VISIÓN</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Ser una empresa líder en el sector juguetero de Bolivia, reconocida por su compromiso con la calidad, 
                  la atención al cliente y la modernización tecnológica. Buscamos consolidarnos como un referente en la 
                  gestión comercial eficiente y sostenible, expandiendo nuestra presencia a nivel nacional y promoviendo 
                  el desarrollo de una cultura de juego responsable, creativa y educativa.
                </p>
              </div>

              {/* Misión */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">MISIÓN</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  La Juguetería OASIS tiene como misión ofrecer juguetes de alta calidad y seguros que fomenten la 
                  creatividad y el aprendizaje en niños de todas las edades, brindando precios competitivos y un 
                  servicio confiable tanto para clientes minoristas como mayoristas. Nos comprometemos a proporcionar 
                  una experiencia de compra satisfactoria, basada en la innovación, la responsabilidad y la incorporación 
                  de tecnologías de información, que optimicen la gestión comercial y fortalezcan la relación con nuestros 
                  clientes y proveedores.
                </p>
              </div>
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