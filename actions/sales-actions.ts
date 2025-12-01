'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// 1. OBTENER DATOS PARA EL POS
export async function getPosData() {
  try {
    // A) Traer Productos que tengan Stock
    const productsDB = await prisma.producto.findMany({
      where: { stockActual: { gt: 0 } }, // Solo stock mayor a 0
      include: {
        categoria: true,
        marca: true,
        precios: {
          orderBy: { id: 'desc' }, // El precio más reciente
          take: 1,
        },
      },
    });

    // Mapeamos al formato simple que usa tu frontend
    const products = productsDB.map(p => ({
      id: p.id,
      nombre: p.nombre || 'Sin Nombre',
      // Si no tiene precio, ponemos 0. Si tiene, usamos el último.
      precio: p.precios[0]?.monto ? Number(p.precios[0].monto) : 0,
      stock: p.stockActual || 0,
      category: p.categoria?.nombre || 'General',
      sku: p.codigo || `SKU-${p.id}`,
    }));

    // B) Traer Clientes
    const clientsDB = await prisma.cliente.findMany({
      include: {
        persona: true,
        tipoCliente: true,
      }
    });

    const clients = clientsDB.map(c => ({
      id: c.id,
      nombre: `${c.persona.nombre} ${c.persona.apellido}`,
      ci: c.persona.documento || 'S/N',
      // Detectamos si es VIP basado en el nombre del tipo de cliente
      tipo: c.tipoCliente?.nombre?.toUpperCase().includes('VIP') ? 'Vip' : 'Normal',
    }));

    return { products, clients };

  } catch (error) {
    console.error('Error fetching POS data:', error);
    return { products: [], clients: [] };
  }
}

// 2. REGISTRAR LA VENTA (Transacción)
export async function createSale(clienteId: number | null, items: any[], total: number) {
  try {
    if (items.length === 0) return { success: false, error: 'Carrito vacío' };

    // Usamos transacción para asegurar que si falla algo, no se cobre ni se reste stock
    await prisma.$transaction(async (tx) => {
      
      // A) Crear el Pedido
      const pedido = await tx.pedido.create({
        data: {
          fecha: new Date(),
          estado: 'COMPLETADO',
          clienteId: clienteId, 
        },
      });

      // B) Crear la Factura
      const factura = await tx.factura.create({
        data: {
          fecha: new Date(),
          total: total,
          pedidoId: pedido.id,
        },
      });

      // C) Procesar cada producto del carrito
      for (const item of items) {
        // 1. Guardar el detalle
        await tx.detallePedido.create({
          data: {
            pedidoId: pedido.id,
            productoId: item.id,
            cantidad: item.cantidad,
            precioUnitario: item.precio,
          },
        });

        // 2. RESTAR STOCK (La magia automática)
        await tx.producto.update({
          where: { id: item.id },
          data: {
            stockActual: {
              decrement: item.cantidad, 
            },
          },
        });
      }
    });

    // Revalidamos para actualizar el stock en la pantalla
    revalidatePath('/dashboard/ventas');
    revalidatePath('/dashboard/inventario');
    revalidatePath('/dashboard/productos');
    
    return { success: true };

  } catch (error) {
    console.error('Error creating sale:', error);
    return { success: false, error: 'Error al procesar la venta en base de datos.' };
  }
}