import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

import { generatePDF, generateExcel } from '@/lib/report-generator';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const formatType = searchParams.get('format');

        // 1. Stock por Categoría
        // Necesitamos iterar productos y sumar stock * precio
        const productos = await prisma.producto.findMany({
            include: {
                categoria: true,
                precios: {
                    orderBy: { id: 'desc' },
                    take: 1
                }
            }
        });

        const categoriasMap = new Map();

        productos.forEach(p => {
            const catName = p.categoria?.nombre || 'Sin Categoría';
            const current = categoriasMap.get(catName) || { categoria: catName, totalStock: 0, valorTotal: 0 };

            const precio = p.precios[0]?.monto ? Number(p.precios[0].monto) : 0;
            const stock = p.stockActual || 0;

            categoriasMap.set(catName, {
                categoria: catName,
                totalStock: current.totalStock + stock,
                valorTotal: current.valorTotal + (stock * precio)
            });
        });

        const stockPorCategoria = Array.from(categoriasMap.values());

        // 2. Productos Bajo Stock
        // Asumimos un umbral fijo de 10 si no hay config
        const LOW_STOCK_THRESHOLD = 10;
        const productosBajoStock = productos
            .filter(p => (p.stockActual || 0) < LOW_STOCK_THRESHOLD)
            .map(p => ({
                nombre: p.nombre,
                stock: p.stockActual,
                minStock: LOW_STOCK_THRESHOLD,
                ubicacion: 'Almacén Principal' // Placeholder
            }));

        // 3. Historial de Movimientos
        // Usamos la tabla Inventario (que parece ser un snapshot o registro de entrada inicial) 
        // O AjusteInventario si hubiera datos.
        // Vamos a traer los últimos registros de 'Inventario' como "Entradas recientes"
        const movimientosDB = await prisma.inventario.findMany({
            take: 10,
            orderBy: { fecha: 'desc' },
            include: {
                producto: true
            }
        });

        const inventoryMovements = movimientosDB.map(m => ({
            timestamp: format(m.fecha, 'dd/MM/yyyy HH:mm', { locale: es }),
            product: m.producto?.nombre || 'Desconocido',
            type: 'Entrada / Ajuste', // La tabla Inventario suele ser para inicializar o agregar
            quantity: m.stock,
            user: 'Sistema'
        }));

        const reportData = {
            stockPorCategoria,
            productosBajoStock,
            inventoryMovements,
            // Tabla genérica para el reporte
            tableData: stockPorCategoria.map(c => ({
                Categoría: c.categoria,
                Stock: c.totalStock,
                Valor: `Bs. ${c.valorTotal.toLocaleString()}`
            }))
        };

        if (formatType === 'pdf') {
            const pdfBuffer = await generatePDF(reportData, 'Reporte de Inventario');
            return new NextResponse(pdfBuffer as any, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=reporte_inventario.pdf'
                }
            });
        } else if (formatType === 'excel') {
            const excelBuffer = await generateExcel(reportData, 'Reporte de Inventario');
            return new NextResponse(excelBuffer as any, {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': 'attachment; filename=reporte_inventario.xlsx'
                }
            });
        }

        return NextResponse.json(reportData);

    } catch (error) {
        console.error('Error fetching inventory report:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
