import FeatureCard from '@/components/ui/FeatureCard'

const features = [
  {
    icon: '🚚',
    title: 'Envío Rápido',
    description: 'Recibe tus juguetes en 24-48 horas con nuestro servicio de envío express.'
  },
  {
    icon: '🛡️',
    title: 'Calidad Garantizada',
    description: 'Todos nuestros productos cumplen con los más altos estándares de seguridad.'
  },
  {
    icon: '🎯',
    title: 'Educativos',
    description: 'Juguetes diseñados para estimular el aprendizaje y desarrollo.'
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          ¿Por qué elegirnos?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};