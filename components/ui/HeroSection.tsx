'use client';
interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  backgroundImage?: string; // <-- AÑADIDA AQUÍ
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  primaryButtonHref?: string;
  secondaryButtonHref?: string;
}

export default function HeroSection({
  title,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
  backgroundImage = '/api/placeholder/1920/800'
}: HeroSectionProps) {
  return (
    <section 
      className="relative h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <img 
    src="/BANER OASIS.png" 
    alt="Banner" 
    className="absolute inset-0 w-full h-full object-cover"
  />
  
  {/* Overlay oscuro */}
  <div className="absolute inset-0 bg-black/40"></div>
  
  {/* Contenido existente */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            {title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-delay">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <button
              onClick={onPrimaryClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-300 transform hover:scale-105"
            >
              {primaryButtonText}
            </button>
            <button
              onClick={onSecondaryClick}
              className="bg-transparent hover:bg-white hover:text-gray-900 text-white border-2 border-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              {secondaryButtonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}