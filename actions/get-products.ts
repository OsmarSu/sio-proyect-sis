'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type ProductWithDetails = {
  id: number;
  nombre: string;
  codigo: string;
  categoria: string;
  marca: string;
  precio: number;
  stock: number;
  estado: 'DISPONIBLE' | 'STOCK BAJO' | 'AGOTADO';
  imagenUrl: string;
};

export async function getProducts(): Promise<ProductWithDetails[]> {
  try {
    const products = await prisma.producto.findMany({
      include: {
        categoria: true,
        marca: true,
        inventarios: true,
        precios: {
          orderBy: {
            id: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    return products.map((product) => {
      // 1. Flatten Price
      const precioDecimal = product.precios[0]?.monto;
      const precio = precioDecimal ? Number(precioDecimal) : 0;

      // 2. Calculate Total Stock
      const stock = product.inventarios.reduce((acc, curr) => acc + (curr.stock || 0), 0);

      // 3. Determine Status
      let estado: 'DISPONIBLE' | 'STOCK BAJO' | 'AGOTADO' = 'DISPONIBLE';
      if (stock === 0) {
        estado = 'AGOTADO';
      } else if (stock <= 5) {
        estado = 'STOCK BAJO';
      }

      // 4. Handle Image
      const imagenUrl = product.imagenUrl || 'https://placehold.co/600x400?text=No+Image';

      return {
        id: product.id,
        nombre: product.nombre || 'Sin Nombre',
        codigo: product.codigo || `ID: ${product.id}`,
        categoria: product.categoria?.nombre || 'Sin Categoría',
        marca: product.marca?.nombre || 'Sin Marca',
        precio,
        stock,
        estado,
        imagenUrl,
      };
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
