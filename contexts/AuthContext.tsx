"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
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

  const register = async (email: string, pass: string, name: string) => {
    setIsLoggingIn(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrarse");
      }

      // Si el registro es exitoso y el endpoint ya setea la cookie,
      // podemos intentar hacer login automático o simplemente redirigir.
      // Dado que el endpoint /api/auth/register ya hace setAuthCookie,
      // el usuario debería estar logueado.

      // Forzamos una actualización de la sesión si es necesario, 
      // pero con next-auth a veces se requiere un signIn explícito para actualizar el cliente.
      // Sin embargo, si usamos JWT custom como parece en el endpoint, 
      // la cookie ya está puesta.

      // Para asegurar compatibilidad con useSession de next-auth, 
      // a veces es mejor hacer un signIn automático.

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password: pass,
      });

      if (result?.error) {
        // Si falla el login automático, redirigimos a login
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }

    } catch (error: any) {
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user,
        login,
        logout,
        register,
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