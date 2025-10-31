export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-blue-400">Juguetería</span>
              <span className="text-2xl font-bold text-white">SIO</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Tu tienda de confianza para los mejores juguetes educativos y divertidos. 
              Creando sonrisas desde 2010.
            </p>
            <div className="flex space-x-4">
              <span className="text-2xl">📘</span>
              <span className="text-2xl">📷</span>
              <span className="text-2xl">🐦</span>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#inicio" className="text-gray-300 hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#productos" className="text-gray-300 hover:text-white transition-colors">Productos</a></li>
              <li><a href="#nosotros" className="text-gray-300 hover:text-white transition-colors">Nosotros</a></li>
              <li><a href="#contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-300">
              <li>📞 +1 (555) 123-4567</li>
              <li>✉️ info@jugueteriasio.com</li>
              <li>📍 Av. Principal 123, Ciudad</li>
              <li>🕒 Lun-Vie: 9:00-18:00</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Juguetería SIO. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}