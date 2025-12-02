// components/ProviderWrapper.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense } from "react";
import { Session } from "next-auth";

export default function ProviderWrapper({ children, session }: { children: React.ReactNode, session: Session | null }) {
  return (
    <Suspense fallback={<div>Cargando sesión...</div>}>
      <SessionProvider session={session}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </SessionProvider>
    </Suspense>
  );
}