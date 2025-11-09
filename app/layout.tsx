// app/layout.tsx

import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext'; // 1. ¡IMPORTAMOS EL PROVIDER!

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Oasis Toys - Tienda de Juguetes',
  description: 'Descubre la magia del juego.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${nunito.variable} font-sans`}>
        {/* 2. ENVOLVEMOS TODA LA APLICACIÓN CON EL AUTHPROVIDER */}
        <AuthProvider>
          {/* Header, Footer, y el resto de tu app ahora viven DENTRO del AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}