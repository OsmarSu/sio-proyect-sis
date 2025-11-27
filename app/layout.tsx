// app/layout.tsx
import ProviderWrapper from "@/components/ProviderWrapper"; // <--- ¿TIENES ESTO?
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* Todo debe estar DENTRO del ProviderWrapper */}
        <ProviderWrapper>
          {children}
        </ProviderWrapper>
      </body>
    </html>
  );
}