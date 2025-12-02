'use server';

import prisma from '@/lib/prisma';

export interface DashboardStats {
    totalProducts: number;
    lowStockCount: number;
    totalSuppliers: number;
    totalSalesMonth: number; // En Bs.
    lowStockProducts: {
        id: number;
        name: string;
        stock: number;
        minStock: number;
        image: string;
    }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        // 1. Conteos Básicos
        const totalProducts = await prisma.producto.count();
        const totalSuppliers = await prisma.proveedor.count();

        // 2. Productos con Stock Bajo (Asumiendo umbral fijo de 10 o campo minStock si existiera)
        // El esquema no tiene minStock en Producto, usaremos un valor fijo o buscaremos si hay configuración
        const LOW_STOCK_THRESHOLD = 10;

        const lowStockProductsRaw = await prisma.producto.findMany({
            where: {
                stockActual: {
                    lte: LOW_STOCK_THRESHOLD,
                },
            },
            take: 5, // Top 5 para el dashboard
            orderBy: {
                stockActual: 'asc',
            },
        });

        const lowStockCount = await prisma.producto.count({
            where: {
                stockActual: {
                    lte: LOW_STOCK_THRESHOLD,
                },
            },
        });

        // 3. Ventas del Mes (Simplificado: Suma de totales de facturas del mes actual)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const sales = await prisma.factura.aggregate({
            _sum: {
                total: true,
            },
            where: {
                fecha: {
                    gte: startOfMonth,
                },
            },
        });

        return {
            totalProducts,
            totalSuppliers,
            lowStockCount,
            totalSalesMonth: Number(sales._sum.total || 0),
            lowStockProducts: lowStockProductsRaw.map(p => ({
                id: p.id,
                name: p.nombre || 'Sin Nombre',
                stock: p.stockActual || 0,
                minStock: LOW_STOCK_THRESHOLD, // Hardcoded por ahora
                // @ts-ignore
                image: p.imagenUrl || '',
            })),
        };

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            totalProducts: 0,
            lowStockCount: 0,
            totalSuppliers: 0,
            totalSalesMonth: 0,
            lowStockProducts: [],
        };
    }
}
