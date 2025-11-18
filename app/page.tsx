'use client';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Image from 'next/image';
import HeroSection from '../components/ui/HeroSection';

export default function LandingPage() {
  // Productos destacados con imágenes reales
  const featuredProducts = [
    {
      id: 1,
      name: 'Lego Classic',
      price: 229.99,
      image: 'https://www.lego.com/cdn/cs/set/assets/blt10888b5e58f4fa76/3_11029_Classic_Sidekick_tall.jpg?fit=crop&format=jpg&quality=80&width=800&height=600&dpr=1',
      category: 'Construcción',
      isNew: true
    },
    {
      id: 2,
      name: 'Muñeca Barbie Dreamhouse',
      price: 689.99,
      image: 'https://toysmart.co/cdn/shop/products/01605-1_720x.jpg?v=1707227997',
      category: 'Muñecas'
    },
    {
      id: 3,
      name: 'Hot Wheels Pista Extrema',
      price: 345.99,
      image: 'https://http2.mlstatic.com/D_NQ_NP_670063-MLA89683253713_082025-O.webp',
      category: 'Vehículos'
    },
    {
      id: 4,
      name: 'Kit de juguetes de Doctor',
      price: 419.99,
      image: 'https://m.media-amazon.com/images/I/71XswLSDL0L._AC_UF894,1000_QL80_.jpg',
      category: 'Educativos',
      isNew: true
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
      
      <main className="md:mt-16">
        {/* Hero Section - SECCIÓN 1 (sin cambio de fondo, pero texto con sombra) */}
        <div className="hero-section-wrapper">
          <style jsx>{`
            .hero-section-wrapper :global(.hero-text) {
              text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
            }
          `}</style>
          <HeroSection
            title="Descubre la Magia del Juego"
            subtitle="Los mejores juguetes educativos y divertidos para todas las edades"
            primaryButtonText="Explorar Catálogo"
            secondaryButtonText="Ver Ofertas"
            onPrimaryClick={handleExploreProducts}
            onSecondaryClick={handleExploreProducts}
          />
        </div>

        {/* Features Section - SECCIÓN 2 - Fondo Rosa Suave */}
        <section id="nosotros" className="py-16 bg-gradient-to-br from-rose-100 via-pink-100 to-rose-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                ¡Descubre por qué somos tu mejor elección!
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Más que juguetes, ofrecemos soluciones pensadas para negocios y familias. 
                Queremos que cada compra sea simple, segura y beneficiosa para ti, con opciones 
                flexibles, métodos confiables y envíos que se adaptan a tus necesidades.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Ventas por Mayor y Menor */}
              <div className="bg-white rounded-xl p-8 border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  ¡Compra como quieras!
                </h3>
                <p className="text-gray-700 text-center leading-relaxed">
                  Ya sea que necesites grandes cantidades para tu negocio o solo un juguete especial, 
                  tenemos opciones para ventas por mayor y menor con precios que te encantarán.
                </p>
              </div>

              {/* Pagos Fácil y Seguro */}
              <div className="bg-white rounded-xl p-8 border border-green-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-6 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  ¡Paga sin complicaciones!
                </h3>
                <p className="text-gray-700 text-center leading-relaxed">
                  Aceptamos pagos por QR, efectivo y depósitos bancarios para que tu experiencia 
                  sea rápida, segura y cómoda.
                </p>
              </div>

              {/* Envíos para Mayoristas */}
              <div className="bg-white rounded-xl p-8 border border-orange-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl mb-6 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  ¡Llega donde estés!
                </h3>
                <p className="text-gray-700 text-center leading-relaxed">
                  Realizamos envíos confiables y rápidos exclusivamente para compras al por mayor, 
                  asegurando que tu pedido llegue en perfectas condiciones.
                </p>
              </div>
            </div>

            {/* Visión y Misión - SECCIÓN 3 - Fondo Verde-Celeste Suave */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 p-8 rounded-3xl bg-gradient-to-br from-cyan-50 via-teal-50 to-cyan-100">
              {/* Visión */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-blue-200 shadow-sm">
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
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-green-200 shadow-sm">
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

        {/* Featured Products - SECCIÓN 4 - Fondo Verde Suave */}
        <section className="py-16 bg-gradient-to-br from-green-100 via-lime-100 to-green-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Productos Destacados</h2>
              <p className="text-xl text-gray-600">
                Los juguetes más populares y nuevos de nuestra colección
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <div className="bg-gray-100 h-48 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        Nuevo
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                    <h3 className="font-bold text-lg mb-3 text-gray-900">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-2xl text-blue-600">
                        Bs. {product.price.toFixed(2)}
                      </span>
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold transform hover:scale-105">
                        Ver más
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleViewAllProducts}
                className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-300 inline-flex items-center gap-2"
              >
                Ver todos los productos
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
