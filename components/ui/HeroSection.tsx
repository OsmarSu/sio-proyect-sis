'use client';
import { Button } from '@/components/ui/ButtonCli';
import Link from 'next/link';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  className?: string;
}

export const HeroSection = ({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  className = ''
}: HeroSectionProps) => {
  return (
    <section className={`container mx-auto px-4 py-16 md:py-24 ${className}`}>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {primaryAction && (
              <Link href={primaryAction.href}>
                <Button size="lg">
                  {primaryAction.label}
                </Button>
              </Link>
            )}
            {secondaryAction && (
              <Link href={secondaryAction.href}>
                <Button variant="outline" size="lg">
                  {secondaryAction.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="relative">
          <div className="bg-indigo-200 rounded-2xl p-8 aspect-square flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-4xl">🎮</span>
              </div>
              <p className="text-gray-600">Imagen destacada de juguetes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};