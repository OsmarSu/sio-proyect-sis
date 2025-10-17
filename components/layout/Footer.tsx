import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Logo className="text-white" />
            <p className="text-gray-400 mt-4">
              Tu tienda de confianza para los mejores juguetes educativos y divertidos.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/cliente/catalogo" className="hover:text-white">Catálogo</Link></li>
              <li><Link href="/login" className="hover:text-white">Iniciar Sesión</Link></li>
              <li><Link href="/register" className="hover:text-white">Registrarse</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📧 info@toystore.com</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 Ciudad, País</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-white">Política de Privacidad</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ToyStore. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};