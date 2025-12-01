'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type Category = {
  id: number;
  nombre: string;
  countProductos: number;
};

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.categoria.findMany({
      include: {
        _count: {
          select: { productos: true },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      nombre: cat.nombre || 'Sin Nombre',
      countProductos: cat._count.productos,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
