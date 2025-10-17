interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  image?: string;
  emoji?: string;
  className?: string;
}

export const ProductCard = ({
  name,
  description,
  price,
  image,
  emoji = '🎁',
  className = ''
}: ProductCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow ${className}`}>
      <div className="bg-gray-100 rounded-lg h-48 mb-4 flex items-center justify-center">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <span className="text-4xl">{emoji}</span>
        )}
      </div>
      <h3 className="font-semibold text-lg mb-2 text-gray-900">{name}</h3>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      <div className="flex justify-between items-center">
        <span className="font-bold text-indigo-600">${price.toFixed(2)}</span>
      </div>
    </div>
  );
};