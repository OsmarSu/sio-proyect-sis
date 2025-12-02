'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// --- CREATE PRODUCT ---
export async function createProduct(formData: FormData) {
  try {
    const nombre = formData.get('nombre') as string;
    const codigo = formData.get('codigo') as string;
    const categoriaId = Number(formData.get('categoriaId'));
    const marcaId = Number(formData.get('marcaId'));
    const precio = Number(formData.get('precio'));
    const stock = Number(formData.get('stock'));
    const imagenUrl = formData.get('imagenUrl') as string;

    // Validación básica
    if (!nombre || !categoriaId || !marcaId) {
      return { success: false, error: 'Nombre, Categoría y Marca son obligatorios' };
    }

    // Transacción
    const result = await prisma.$transaction(async (tx) => {
      // 1. Producto
      const product = await tx.producto.create({
        data: {
          nombre,
          codigo,
          categoriaId,
          marcaId,
          stockActual: stock,
          imagenUrl: imagenUrl || null,
        },
      });

      // 2. Precio
      if (precio > 0) {
        await tx.precio.create({
          data: {
            productoId: product.id,
            monto: precio,
            tipoPrecioId: 1, 
          },
        });
      }

      // 3. Inventario
      if (stock > 0) {
        const almacenDefault = await tx.almacen.findFirst();
        if (almacenDefault) {
          await tx.inventario.create({
            data: {
              productoId: product.id,
              stock: stock,
              almacenId: almacenDefault.id,
              fecha: new Date(),
            },
          });
        }
      }
      
      return product;
    });

    // Revalidar caché para ver los cambios en la lista
    revalidatePath('/dashboard/productos');

    // ✅ DEVOLVEMOS ÉXITO (El frontend se encarga de redirigir)
    return { success: true, product: result };

  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Error al crear el producto.' };
  }
}

// --- UPDATE PRODUCT ---
export async function updateProduct(id: number, formData: FormData) {
  try {
    const nombre = formData.get('nombre') as string;
    const codigo = formData.get('codigo') as string;
    const categoriaId = Number(formData.get('categoriaId'));
    const marcaId = Number(formData.get('marcaId'));
    const precio = Number(formData.get('precio'));
    const stock = Number(formData.get('stock'));
    const imagenUrl = formData.get('imagenUrl') as string;

    await prisma.$transaction(async (tx) => {
      // 1. Actualizar Producto
      await tx.producto.update({
        where: { id },
        data: {
          nombre,
          codigo,
          categoriaId,
          marcaId,
          stockActual: stock,
          imagenUrl: imagenUrl || null,
        },
      });

      // 2. Precio (Histórico)
      if (precio > 0) {
        await tx.precio.create({
          data: {
            productoId: id,
            monto: precio,
            tipoPrecioId: 1,
          },
        });
      }
    });

    revalidatePath('/dashboard/productos');
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Error al actualizar' };
  }
}

// --- DELETE PRODUCT ---
export async function deleteProduct(id: number) {
  try {
    // Borramos dependencias primero
    await prisma.precio.deleteMany({ where: { productoId: id } });
    await prisma.inventario.deleteMany({ where: { productoId: id } });
    // Borramos producto
    await prisma.producto.delete({ where: { id } });

    revalidatePath('/dashboard/productos');
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Error al eliminar' };
  }
}