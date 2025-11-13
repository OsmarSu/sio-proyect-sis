'use client';

import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-neutral-950 text-white py-12">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="col-span-1 md:col-span-2">
            <a href="#inicio" className="inline-block mb-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-400">Juguetería</span>
                <span className="text-2xl font-bold text-white">OASIS</span>
              </div>
            </a>
            <p className="text-gray-300 mb-6 max-w-md">
              Tu tienda de confianza para los mejores juguetes educativos y divertidos. 
              Creando sonrisas desde 2017.
            </p>
            <div className="flex space-x-5">
              <a 
                href="https_tu_facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="text-gray-300 hover:text-blue-500 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href="https_tu_instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="text-gray-300 hover:text-pink-500 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaInstagram size={24} />
              </a>
              <a 
                href="https_tu_twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Twitter"
                className="text-gray-300 hover:text-blue-400 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaTwitter size={24} />
              </a>
              <a 
                href="https_tu_whatsapp.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp"
                className="text-gray-300 hover:text-green-500 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>

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
        </div>
        
        <div className="border-t border-neutral-800 mt-10 pt-8 text-center text-gray-300">
          <p>&copy; 2025 Juguetería OASIS. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}