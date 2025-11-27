"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const login = async (email: string, pass: string) => {
    setIsLoggingIn(true);
    try {

      const result = await signIn("credentials", {
        redirect: false, 
        email,
        password: pass,
      });

      if (result?.error) {
        throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
      }

      // Si todo sale bien, vamos al dashboard
      router.push("/dashboard"); 
      router.refresh(); // Actualiza los componentes del servidor
    } catch (error: any) {
      throw error; // Re-lanzamos el error para que tu LoginPage lo muestre en rojo
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user: session?.user, 
        login, 
        logout, 
        isLoading: status === "loading" || isLoggingIn 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};