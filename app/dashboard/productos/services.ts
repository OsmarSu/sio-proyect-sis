// app/dashboard/productos/services.ts
import prisma from '@/lib/prisma';
import { Product } from './types';

export async function getProductsForDashboard(): Promise<Product[]> {
  const productos = await prisma.producto.findMany({
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      stockActual: true, // Leemos directo de la columna
      
      categoria: { select: { nombre: true } },
      marca: { select: { nombre: true } },
      lineaProducto: { select: { nombre: true } }, // Relación
      unidadMedida: { select: { nombre: true } },  // Relación

      precios: {
        select: {
          monto: true,
          tipoPrecio: { select: { nombre: true } },
          preciosCliente: { include: { tipoCliente: true } }
        },
        orderBy: { id: 'desc' }
      }
    },
    orderBy: { id: 'desc' }
  });

  return productos.map((p) => {
    // Lógica de precios (Mayorista vs Minorista)
    const precioMayor = p.precios.find(
      pr => pr.tipoPrecio?.nombre?.toLowerCase().includes('mayorista') || 
            pr.preciosCliente.length > 0
    );

    const precioMenor = p.precios.find(
      pr => pr.tipoPrecio?.nombre?.toLowerCase().includes('publico') || 
            pr.tipoPrecio?.nombre?.toLowerCase().includes('minorista')
    ) || p.precios[0];

    // ✅ AQUÍ SE ARREGLA EL ERROR DE ASIGNACIÓN
    return {
      id: p.id,
      name: p.nombre ?? 'Sin Nombre',
      description: p.descripcion ?? '',
      
      stockActual: p.stockActual ?? 0, // Mapeamos null a 0
      
      category: p.categoria?.nombre ?? 'General',
      linea: p.lineaProducto?.nombre ?? '', // Si es null, devuelve string vacío
      unidad: p.unidadMedida?.nombre ?? 'Pza',
      marca: p.marca?.nombre ?? 'Genérica',
      
      minorPrice: precioMenor?.monto ? Number(precioMenor.monto) : 0,
      majorPrice: precioMayor?.monto ? Number(precioMayor.monto) : 0,
    };
  });
}