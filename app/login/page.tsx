"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Importación clave para manejar el estado
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function LoginPage() {
  const { login } = useAuth();
  // Usamos useSession directamente para verificar el estado real de la cookie
  const { status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("admin@oasis.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- LÓGICA DE PROTECCIÓN Y REDIRECCIÓN ---
  useEffect(() => {
    // Si NextAuth confirma que estamos autenticados, nos vamos al dashboard
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      // No necesitamos redirigir aquí manualmente,
      // el cambio de estado de sesión disparará el useEffect de arriba.
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión. Inténtalo de nuevo.");
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setEmail("");
    setPassword("");
    setError(null);
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        {/* Fondo degradado suave (el mismo de tu login para consistencia) */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo con efecto de brillo/resplandor */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <Image
              src="/sis_oasis.png"
              alt="Cargando SIO"
              width={80} // Hacemos el logo un poco más grande
              height={80}
              className="rounded-full relative shadow-2xl"
              priority
            />
          </div>

          {/* Spinner Personalizado */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-3 w-3 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-3 w-3 bg-pink-600 rounded-full animate-bounce"></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Bienvenido a Oasis
          </h2>
          <p className="text-gray-500 font-medium mt-1 animate-pulse">
            Preparando tu entorno de trabajo...
          </p>
        </div>
      </div>
    );
  }

  // --- FORMULARIO DE LOGIN (Solo se ve si status === "unauthenticated") ---
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50 relative overflow-hidden pt-16">
        <div className="absolute top-0 left-0 z-0 h-full w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />

        <div className="w-full max-w-md relative z-10 px-8 py-12">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/sis_oasis.png"
                alt="SIO"
                width={56}
                height={56}
                className="rounded-full object-cover"
                priority
              />
              <span className="text-gray-900 font-bold text-2xl">SIO</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
                Bienvenido de vuelta
              </h1>
              <p className="text-gray-600 text-lg text-center">
                Ingresa tus credenciales para continuar
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-center bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 bg-white text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-700">Recordarme</span>
              </label>
            </div>

            {/* Botones de Iniciar Sesión y Limpiar */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Iniciando..." : "Iniciar Sesión"}
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Limpiar
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
