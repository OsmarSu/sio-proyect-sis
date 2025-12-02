// app/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProviderWrapper from "@/components/ProviderWrapper";
import "./globals.css";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="es">
      <body>
        {/* Todo debe estar DENTRO del ProviderWrapper */}
        <ProviderWrapper session={session}>
          {children}
        </ProviderWrapper>
      </body>
    </html>
  );
}