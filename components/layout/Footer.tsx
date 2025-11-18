'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

export default function Footer() {
  
  const direccionMapa = "Entre calle Isabela Católica y La Guardia #235, Santa Cruz, Bolivia";

  return (
    <footer id="contacto" className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1">
            <a href="#inicio" className="inline-block mb-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-cyan-300">Juguetería</span>
                <span className="text-2xl font-bold text-white">OASIS</span>
              </div>
            </a>
            <p className="text-blue-100 mb-6">
              Tu tienda de confianza para los mejores juguetes educativos y divertidos. 
              Creando sonrisas desde 2017.
            </p>
            <div className="flex space-x-5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-blue-100 hover:text-cyan-300 transition-all duration-300 transform hover:-translate-y-0.5"><FaFacebook size={24} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-blue-100 hover:text-pink-300 transition-all duration-300 transform hover:-translate-y-0.5"><FaInstagram size={24} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-blue-100 hover:text-cyan-300 transition-all duration-300 transform hover:-translate-y-0.5"><FaTwitter size={24} /></a>
              <a href="https://wa.me/59176535535" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-blue-100 hover:text-green-300 transition-all duration-300 transform hover:-translate-y-0.5"><FaWhatsapp size={24} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-blue-100 hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/cliente/catalogo" className="text-blue-100 hover:text-white transition-colors">Productos</Link></li>
              <li><Link href="/#nosotros" className="text-blue-100 hover:text-white transition-colors">Nosotros</Link></li>
              <li><Link href="/#contacto" className="text-blue-100 hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">Contacto</h3>
            <ul className="space-y-4 text-blue-100">
              <li className="flex items-start gap-3">
                <FiPhone className="mt-1 flex-shrink-0 text-cyan-300" size={18} />
                <span>76535535</span>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-1 flex-shrink-0 text-cyan-300" size={18} />
                <span>{direccionMapa}</span>
              </li>
              <li className="flex items-start gap-3">
                <FiClock className="mt-1 flex-shrink-0 text-cyan-300" size={18} />
                <span>Lun-Vie: 9:00-18:00</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">Nuestra Ubicación</h3>
            <div className="rounded-lg overflow-hidden shadow-lg border-2 border-blue-700">
              <iframe 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(direccionMapa)}&z=17&output=embed&iwloc=A`}
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
        
        <div className="border-t border-blue-700 mt-10 pt-8 text-center text-blue-100">
          <p>© 2025 Juguetería OASIS. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}