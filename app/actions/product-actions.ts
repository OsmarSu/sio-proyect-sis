// app/actions/product-actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductFormData } from "../dashboard/productos/types";

export async function createProductAction(data: ProductFormData) {
  try {
    // 1. Buscamos dependencias necesarias
    const almacenDefault = await prisma.almacen.findFirst();
    const unidadDefault = await prisma.unidadMedida.findFirst();

    if (!almacenDefault || !unidadDefault) {
      throw new Error(
        "Error de Configuración: Falta Almacén o Unidad de Medida en BD"
      );
    }

    // 2. Lógica inteligente para Categoría y Marca
    // Buscamos si existe una categoría con ese nombre, si no, la creamos.
    let categoria = await prisma.categoria.findFirst({
      where: { nombre: data.category },
    });
    if (!categoria) {
      categoria = await prisma.categoria.create({
        data: { nombre: data.category },
      });
    }

    let marca = await prisma.marca.findFirst({
      where: { nombre: data.supplier },
    });
    if (!marca) {
      marca = await prisma.marca.create({ data: { nombre: data.supplier } });
    }

    // 3. Creación del Producto Maestro
    await prisma.producto.create({
      data: {
        nombre: data.name,
        descripcion: data.description,
        /* sku: data.code,
        minStock: data.minStock,
        cost: data.majorPrice, // Si agregaste el campo a la BD, sino bórralo */

        // Conexiones usando los IDs que encontramos/creamos arriba
        categoriaId: categoria.id,
        marcaId: marca.id,
        unidadMedidaId: unidadDefault.id,

        // Crear registros hijos automáticamente
        precios: {
          create: { monto: data.minorPrice },
        },
        inventarios: {
          create: {
            almacenId: almacenDefault.id,
            stock: data.currentStock,
          },
        },
      },
    });

    // 4. Actualizar la vista automáticamente
    revalidatePath("/dashboard/productos");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error al guardar en base de datos" };
  }
}
