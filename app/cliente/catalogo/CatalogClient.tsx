// components/ui/ProductCard.tsx
import Link from 'next/link';

// Definición de las propiedades que el componente espera
interface ProductCardProps {
  id: string; // <-- ¡AÑADIDO Y CORREGIDO!
  name: string;
  description: string;
  price: number;
  image?: string;
  emoji?: string;
  className?: string;
  originalPrice?: number;
  ageRange?: string;
  rating?: number;
  stock?: number;
  isNew?: boolean;
  isOnSale?: boolean;
}

export const ProductCard = ({
  id, // <-- ¡AHORA RECIBIMOS EL ID!
  name,
  description,
  price,
  image,
  emoji = '🎁',
  className = '',
  originalPrice,
  ageRange,
  rating,
  stock,
  isNew,
  isOnSale
}: ProductCardProps) => {
  return (
    // Usamos un Link para que toda la tarjeta sea clickeable y lleve al detalle del producto
    <Link href={`/producto/${id}`} className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col ${className}`}>
      <div className="relative">
        <div className="bg-gray-100 rounded-lg h-48 mb-4 flex items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span className="text-4xl">{emoji}</span>
          )}
        </div>
        
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {isNew && <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">Nuevo</span>}
          {isOnSale && <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">Oferta</span>}
        </div>
      </div>
      
      <div className="flex flex-col flex-grow">
        <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2 flex-grow">{name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between mb-3">
          {ageRange && <span className="text-gray-500 text-sm">{ageRange}</span>}
          {rating && (
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600 ml-1">{rating}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-indigo-600">${price.toFixed(2)}</span>
            {originalPrice && originalPrice > price && <span className="text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</span>}
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm z-10" onClick={(e) => { e.preventDefault(); alert(`Agregando ${name} al carrito`); }}>
            Agregar
          </button>
        </div>
        
        {stock !== undefined && stock < 10 && stock > 0 && <p className="text-orange-500 text-xs mt-2">Solo quedan {stock}</p>}
        {stock === 0 && <p className="text-red-500 text-xs mt-2">Agotado</p>}
      </div>
    </Link>
  );
};
export default ProductCard;