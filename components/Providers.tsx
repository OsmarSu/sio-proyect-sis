// components/Providers.tsx
'use client';

import { ThemeProvider } from 'next-themes'; // Asumo que tienes un ThemeProvider
import { AuthProvider } from '@/contexts/AuthContext'; // 1. IMPORTAMOS EL AUTH PROVIDER
import { ReactNode } from 'react';

// Este componente envuelve toda la aplicación con los diferentes proveedores de contexto.
export default function Providers({ children }: { children: ReactNode }) {
  return (
    // Es posible que tengas otros providers aquí, como ThemeProvider. Mantenlos.
    // El orden no suele importar mucho, pero poner AuthProvider dentro está bien.
    <ThemeProvider attribute="class" defaultTheme="dark">
      {/* 2. ENVOLVEMOS 'children' CON EL AUTHPROVIDER */}
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
