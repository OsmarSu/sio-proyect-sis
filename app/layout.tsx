// app/layout.tsx

import type { Metadata } from "next";
// 1. Cambiamos la importación: quitamos Geist y añadimos Inter.
import { Inter } from "next/font/google"; 
import Providers from "@/components/Providers";
import "./globals.css";

// 2. Instanciamos 'Inter' en lugar de Geist.
//    'variable' es la forma moderna y recomendada de usar fuentes.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Creamos una variable CSS llamada --font-inter
});

// 3. (Sugerencia) Actualizamos los metadatos de tu página.
export const metadata: Metadata = {
  title: "Oasis - Sistema de Gestión",
  description: "Sistema de gestión de inventario para la Juguetería Oasis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 4. Cambiamos el idioma a español.
    <html lang="es">
      {/* 5. Aplicamos la variable de la fuente al body.
          La clase 'font-sans' se configurará en Tailwind para usar esta fuente. */}
      <body
        className={`${inter.variable} font-sans antialiased bg-neutral-950 text-white`}
      >
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}