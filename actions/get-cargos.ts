// actions/get-cargos.ts
import prisma from '@/lib/prisma';
import { Cargo } from '@/types/user';

export async function getCargos(): Promise<Cargo[]> {
  try {
    const cargos = await prisma.cargo.findMany({
      select: {
        id: true,
        nombre: true,
      },
      orderBy: { nombre: 'asc' }
    });

    return cargos.map(c => ({
      id: c.id,
      nombre: c.nombre ?? 'Sin nombre'
    }));
  } catch (error) {
    console.error('Error al obtener cargos:', error);
    return [];
  }
}