'use client';

import Image from 'next/image';
import { ProductWithDetails } from '@/actions/get-products';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';

interface ProductCardProps {
  product: ProductWithDetails;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIBLE':
        return 'bg-green-500 hover:bg-green-600';
      case 'STOCK BAJO':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'AGOTADO':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-md bg-white border-gray-200">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={product.imagenUrl}
          alt={product.nombre}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 text-black backdrop-blur-sm shadow-sm">
            {product.categoria}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg leading-tight line-clamp-2" title={product.nombre}>
              {product.nombre}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{product.codigo}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow">
        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">
              ${product.precio.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">
              Stock: {product.stock}
            </span>
          </div>
          <Badge className={`${getStatusColor(product.estado)} text-white border-0`}>
            {product.estado}
          </Badge>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Marca: {product.marca}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium text-sm"
          >
            Eliminar
          </button>
        )}
      </CardFooter>
    </Card>
  );
}
