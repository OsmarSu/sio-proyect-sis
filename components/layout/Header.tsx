import { Navigation } from '@/components/layout/Navigation';

const navItems = [
  { label: 'Características', href: '#features' },
  { label: 'Catálogo', href: '#catalogo' },
  { label: 'Contacto', href: '#contact' }
];

export const Header = () => {
  return <Navigation navItems={navItems} />;
};