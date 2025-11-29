'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ItemCarrito } from "../dashboard/ventas/VentasClient";

export async function createVentaAction(items: ItemCarrito[], clienteId: number | null, total: number) {
    try {
        if (!items || items.length === 0) {
            return { success: false, error: "El carrito está vacío" };
        }

        // 1. Crear Factura (Simplificado, asumimos una factura por venta)
        const factura = await prisma.factura.create({
            data: {
                fecha: new Date(),
                total: total,
            },
        });

        // 2. Crear Venta vinculada
        const venta = await prisma.venta.create({
            data: {
                fecha: new Date(),
                facturaId: factura.id,
            },
        });

        // 3. Crear Detalles y Actualizar Stock
        for (const item of items) {
            // Crear detalle factura
            await prisma.detalleFactura.create({
                data: {
                    facturaId: factura.id,
                    productoId: item.id,
                    cantidad: item.cantidad,
                    precioUnitario: item.precio,
                },
            });

            // Actualizar Stock (Restar)
            // Nota: Deberíamos buscar el inventario específico, aquí simplificamos restando al primer inventario encontrado o usando lógica de negocio más compleja.
            // Para este ejemplo, vamos a buscar un inventario del producto y restar.
            const inventario = await prisma.inventario.findFirst({
                where: { productoId: item.id },
            });

            if (inventario) {
                await prisma.inventario.update({
                    where: { id: inventario.id },
                    data: { stock: { decrement: item.cantidad } },
                });
            } else {
                // Si no hay inventario, podríamos crearlo con stock negativo o lanzar error.
                // Por ahora, creamos uno nuevo (aunque sea negativo para indicar deuda)
                await prisma.inventario.create({
                    data: {
                        productoId: item.id,
                        stock: -item.cantidad,
                        // almacenId: 1 // Default warehouse?
                    }
                });
            }
        }

        // 4. Revalidar paths
        revalidatePath("/dashboard/ventas");
        revalidatePath("/dashboard/inventario");
        revalidatePath("/dashboard/productos"); // Por si mostramos stock ahí

        return { success: true, data: venta };
    } catch (error) {
        console.error("Error creating sale:", error);
        return { success: false, error: "Error al procesar la venta" };
    }
}
