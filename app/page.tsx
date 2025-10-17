import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/ui/HeroSection';
import { FeaturesSection } from '@/components/layout/FeaturesSection';
import { ProductShowcase } from '@/components/layout/ProductShowcase';
import { Footer } from '@/components/layout/Footer';
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <HeroSection
        title={
          <>
            Los mejores juguetes para{' '}
            <span className="text-indigo-600">tus pequeños</span>
          </>
        }
        subtitle="Descubre nuestro catálogo exclusivo de juguetes educativos, divertidos y seguros para todas las edades."
        primaryAction={{
          label: 'Ver Catálogo',
          href: '/cliente/catalogo'
        }}
        secondaryAction={{
          label: 'Panel Admin',
          href: '/dashboard/inventario'
        }}
      />
      
      <FeaturesSection />
      <ProductShowcase />
      <Footer />
    </div>
  );
}