'use client';

import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-neutral-950 text-white py-12">
      <div className="container mx-auto px-4 ">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Información de la empresa */}
          <div className="lg:col-span-1">
            <a href="#inicio" className="inline-block mb-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-400">Juguetería</span>
                <span className="text-2xl font-bold text-white">OASIS</span>
              </div>
            </a>
            <p className="text-gray-300 mb-6">
              Tu tienda de confianza para los mejores juguetes educativos y divertidos. 
              Creando sonrisas desde 2017.
            </p>
            <div className="flex space-x-5">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="text-gray-300 hover:text-blue-500 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="text-gray-300 hover:text-pink-500 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaInstagram size={24} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Twitter"
                className="text-gray-300 hover:text-blue-400 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaTwitter size={24} />
              </a>
              <a 
                href="https://wa.me/59176535535" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp"
                className="text-gray-300 hover:text-green-500 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Inicio</a></li>
              <li><a href="/cliente/catalogo" className="text-gray-300 hover:text-white transition-colors">Productos</a></li>
              <li><a href="/#nosotros" className="text-gray-300 hover:text-white transition-colors">Nosotros</a></li>
              <li><a href="/#contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <FiPhone className="mt-1 flex-shrink-0" size={18} />
                <span>76535535</span>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-1 flex-shrink-0" size={18} />
                <span>Entre calle Isabela Católica y La Guardia #235, Santa Cruz, Bolivia</span>
              </li>
              <li className="flex items-start gap-3">
                <FiClock className="mt-1 flex-shrink-0" size={18} />
                <span>Lun-Vie: 9:00-18:00</span>
              </li>
            </ul>
          </div>

          {/* Mapa de ubicación */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nuestra Ubicación</h3>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!4v1762392301977!6m8!1m7!1sdwwhBN5o8pk72pzDhJZfGw!2m2!1d-17.79561119236609!2d-63.1928588741025!3f89.62877244900278!4f-13.585616537274234!5f0.7820865974627469" 
                width="250" 
                height="250" 
                style={{border:0}} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Juguetería Oasis"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-10 pt-8 text-center text-gray-300">
          <p>&copy; 2025 Juguetería OASIS. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}