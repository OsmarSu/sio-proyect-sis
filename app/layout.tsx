// app/layout.tsx

import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

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
    <body className={`${nunito.variable} font-sans antialiased bg-neutral-950 text-white`}>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <AuthProvider>
        {children}
      </AuthProvider>
    </body>
  </html>
)};
