// components/ui/Badge.tsx

import React from 'react';

// Estas son las variantes de color que puede tener
type BadgeVariant = 'default' | 'primary' | 'success' | 'danger';

// Esta es la "forma" de las props que el componente espera
interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant; // El '?' lo hace opcional
  className?: string;     // El '?' lo hace opcional
}

const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-neutral-700/50 text-gray-300',
    primary: 'bg-blue-900 text-blue-300',
    success: 'bg-green-900 text-green-300',
    danger: 'bg-red-900 text-red-300',
  };
  const baseStyles = 'text-xs font-medium px-2.5 py-0.5 rounded-full inline-block';

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;