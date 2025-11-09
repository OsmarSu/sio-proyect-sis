// app/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext'; // 1. IMPORTAMOS EL HOOK DE AUTENTICACIÓN
import { useRouter } from 'next/navigation'; // Necesitamos useRouter para redirigir

export default function RegisterPage() {
  const { register } = useAuth(); // 2. OBTENEMOS LA FUNCIÓN 'register' DEL CONTEXTO
  const router = useRouter(); // Instanciamos el router

  // Tu estado formData original
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // Tus estados para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Nuevos estados para errores y carga
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false); // Para el checkbox de términos

  // Tu función handleChange original
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 3. ¡ESTA ES LA FUNCIÓN handleSubmit CORREGIDA Y COMPLETA!
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    setError(null); // Limpiamos errores anteriores
    setIsLoading(true); // Activamos el estado de carga

    // Validaciones del frontend antes de enviar
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones.');
      setIsLoading(false);
      return;
    }

    try {
      // Llamamos a la función 'register' de tu AuthContext.
      // Esta función se encargará de llamar a la API y el login automático.
      await register(formData.email, formData.password, formData.name);
      
      // Si el registro y el login fueron exitosos (manejado en AuthContext),
      // AuthContext.login ya redirige al usuario. No necesitamos un router.push aquí.

    } catch (err: any) {
      // Si la función 'register' falla (ej. email ya registrado, contraseña débil), mostrará un error.
      setError(err.message || 'Error al registrarse. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false); // Desactivamos el estado de carga
    }
  };

  return (
    <div className="min-h-screen flex bg-neutral-950 relative overflow-hidden">
      {/* Fondo con gradiente */}
      <div className="absolute top-0 z-0 h-full w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      {/* Lado izquierdo - Info (se queda igual) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl items-center justify-center p-12 relative z-10 border-r border-neutral-800">
        <div className="max-w-md">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4">Únete a Oasis</h2>
          <p className="text-gray-300 text-lg mb-8">Crea tu cuenta y comienza a gestionar tu juguetería de manera profesional.</p>
          
          <div className="space-y-4">
            {/* ... (tus características de marketing se quedan igual) ... */}
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo y Título */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-white font-bold text-2xl">OASIS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Crear Cuenta</h1>
            <p className="text-gray-400 text-lg">Completa el formulario para comenzar</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nombre Completo</label>
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-lg text-white ..." placeholder="Juan Pérez" required />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-lg text-white ..." placeholder="tu@email.com" required />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-lg text-white ..." placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">
                  {/* ... (tu icono de ojo) ... */}
                </button>
              </div>
            </div>

            {/* Confirmar Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">Confirmar Contraseña</label>
              <div className="relative">
                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-lg text-white ..." placeholder="••••••••" required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">
                  {/* ... (tu icono de ojo) ... */}
                </button>
              </div>
            </div>

            {/* Términos */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" id="acceptTerms" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="w-4 h-4 mt-1 rounded border-neutral-700 bg-neutral-900 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0" />
              <span className="text-sm text-gray-300">
                Acepto los{' '}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300">términos y condiciones</Link>
                {' '}y la{' '}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300">política de privacidad</Link>
              </span>
            </label>

            {/* Mensaje de Error */}
            {error && (
              <p className="text-red-400 text-center bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
                {error}
              </p>
            )}
            
            {/* Botón de registro */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}