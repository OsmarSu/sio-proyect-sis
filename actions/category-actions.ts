'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function createCategory(nombre: string) {
  try {
    const category = await prisma.categoria.create({
      data: {
        nombre,
      },
    });

    revalidatePath('/dashboard/productos/categorias');
    return { success: true, category };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Error al crear la categoría' };
  }
}

export async function updateCategory(id: number, nombre: string) {
  try {
    const category = await prisma.categoria.update({
      where: { id },
      data: {
        nombre,
      },
    });

    revalidatePath('/dashboard/productos/categorias');
    return { success: true, category };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: 'Error al actualizar la categoría' };
  }
}

export async function deleteCategory(id: number) {
  try {
    // Verificar si tiene productos asociados
    const count = await prisma.producto.count({
      where: { categoriaId: id },
    });

    if (count > 0) {
      return { 
        success: false, 
        error: `No se puede eliminar. Hay ${count} producto(s) asociado(s) a esta categoría.` 
      };
    }

    await prisma.categoria.delete({ where: { id } });

    revalidatePath('/dashboard/productos/categorias');
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Error al eliminar la categoría' };
  }
}
