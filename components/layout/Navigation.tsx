'use client';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/ButtonCli';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
}

interface NavigationProps {
  navItems?: NavItem[];
  className?: string;
}

export const Navigation = ({ 
  navItems = [],
  className = '' 
}: NavigationProps) => {
  return (
    <header className={`bg-white shadow-sm ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a 
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};