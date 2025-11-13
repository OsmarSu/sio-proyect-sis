interface ProductCardProps {
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
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      <div className="relative">
        {/* Imagen del producto */}
        <div className="bg-gray-100 h-56 flex items-center justify-center overflow-hidden">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
            />
          ) : (
            <span className="text-6xl">{emoji}</span>
          )}
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              Nuevo
            </span>
          )}
          {isOnSale && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md animate-pulse">
              Oferta
            </span>
          )}
        </div>
      </div>
      
      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 min-h-[56px]">
          {name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[40px]">
          {description}
        </p>
        
        {/* Información adicional */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          {ageRange && (
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{ageRange}</span>
            </div>
          )}
          {/*rating && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">{rating}</span>
            </div>
          )*/}
        </div>
        
        {/* Precio y botón */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl text-blue-600">
              Bs. {price.toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-400 line-through">
                Bs. {originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Stock */}
          {stock !== undefined && (
            <div className="mb-2">
              {stock > 10 ? (
                <span className="text-green-600 text-sm font-medium">
                  ✓ En stock
                </span>
              ) : stock > 0 ? (
                <span className="text-orange-500 text-sm font-medium">
                  ⚠ Solo quedan {stock}
                </span>
              ) : (
                <span className="text-red-500 text-sm font-medium">
                  ✗ Agotado
                </span>
              )}
            </div>
          )}
          
          {/*<button 
            disabled={stock === 0}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
          </button>*/}
        </div>
      </div>
    </div>
  );
};