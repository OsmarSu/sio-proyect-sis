'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type Brand = {
  id: number;
  nombre: string;
  countProductos: number;
};

export async function getBrands(): Promise<Brand[]> {
  try {
    const brands = await prisma.marca.findMany({
      include: {
        _count: {
          select: { productos: true },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });

    return brands.map((brand) => ({
      id: brand.id,
      nombre: brand.nombre || 'Sin Nombre',
      countProductos: brand._count.productos,
    }));
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}
