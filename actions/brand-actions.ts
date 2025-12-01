'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function createBrand(nombre: string) {
  try {
    const brand = await prisma.marca.create({
      data: {
        nombre,
      },
    });

    revalidatePath('/dashboard/productos/marcas');
    return { success: true, brand };
  } catch (error) {
    console.error('Error creating brand:', error);
    return { success: false, error: 'Error al crear la marca' };
  }
}

export async function updateBrand(id: number, nombre: string) {
  try {
    const brand = await prisma.marca.update({
      where: { id },
      data: {
        nombre,
      },
    });

    revalidatePath('/dashboard/productos/marcas');
    return { success: true, brand };
  } catch (error) {
    console.error('Error updating brand:', error);
    return { success: false, error: 'Error al actualizar la marca' };
  }
}

export async function deleteBrand(id: number) {
  try {
    // Verificar si tiene productos asociados
    const count = await prisma.producto.count({
      where: { marcaId: id },
    });

    if (count > 0) {
      return { 
        success: false, 
        error: `No se puede eliminar. Hay ${count} producto(s) asociado(s) a esta marca.` 
      };
    }

    await prisma.marca.delete({ where: { id } });

    revalidatePath('/dashboard/productos/marcas');
    return { success: true };
  } catch (error) {
    console.error('Error deleting brand:', error);
    return { success: false, error: 'Error al eliminar la marca' };
  }
}
