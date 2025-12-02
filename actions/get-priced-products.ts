'use server';

import prisma from '@/lib/prisma';
import { PricedProduct } from '@/app/dashboard/precios/types';

export async function getPricedProducts(): Promise<PricedProduct[]> {
    try {
        const products = await prisma.producto.findMany({
            include: {
                categoria: true,
                marca: true,
                lineaProducto: true,
                unidadMedida: true,
                precios: {
                    take: 1, // Tomamos uno por ahora, idealmente filtraríamos por tipo
                },
            },
            orderBy: {
                nombre: 'asc',
            },
        });

        return products.map((p) => {
            const currentPrice = p.precios[0];
            return {
                id: p.id,
                // @ts-ignore
                code: p.codigo || 'S/C',
                name: p.nombre || 'Sin Nombre',
                description: p.descripcion || '',
                stockActual: p.stockActual || 0,
                marca: p.marca?.nombre || 'Sin Marca',
                category: p.categoria?.nombre || 'Sin Categoría',
                linea: p.lineaProducto?.nombre || 'Sin Línea',
                unidad: p.unidadMedida?.nombre || 'Unidad',
                minorPrice: currentPrice ? Number(currentPrice.monto) : 0,
                majorPrice: 0, // TODO: Implementar lógica de precios múltiples si existe
                floorPrice: 0, // TODO: Definir lógica de precio piso
                lastUpdate: 'N/A', // No hay fecha en la tabla Precio
            };
        });
    } catch (error) {
        console.error('Error fetching priced products:', error);
        return [];
    }
}
