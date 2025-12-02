import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export const dynamic = 'force-dynamic';

import { generatePDF, generateExcel } from '@/lib/report-generator';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || 'month';
        const formatType = searchParams.get('format');

        let startDate = new Date();
        let endDate = new Date();

        switch (range) {
            case 'today':
                startDate = startOfDay(new Date());
                endDate = endOfDay(new Date());
                break;
            case 'week':
                startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
                endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
                break;
            case 'month':
                startDate = startOfMonth(new Date());
                endDate = endOfMonth(new Date());
                break;
            case 'year':
                startDate = startOfYear(new Date());
                endDate = endOfYear(new Date());
                break;
            default:
                startDate = startOfMonth(new Date());
                endDate = endOfMonth(new Date());
        }

        // 1. Productos Más Vendidos
        // Consultamos DetalleFactura -> Factura (para filtrar por fecha)
        const detalles = await prisma.detalleFactura.findMany({
            where: {
                factura: {
                    fecha: {
                        gte: startDate,
                        lte: endDate,
                    }
                }
            },
            include: {
                producto: true
            }
        });

        const productosMap = new Map();

        detalles.forEach(d => {
            if (!d.producto) return;
            const id = d.producto.id;
            const nombre = d.producto.nombre || 'Desconocido';
            const current = productosMap.get(id) || { nombre, cantidad: 0, ingresos: 0 };

            const cantidad = d.cantidad || 0;
            const precio = Number(d.precioUnitario || 0);

            productosMap.set(id, {
                nombre,
                cantidad: current.cantidad + cantidad,
                ingresos: current.ingresos + (cantidad * precio)
            });
        });

        const productosMasVendidos = Array.from(productosMap.values())
            .sort((a: any, b: any) => b.cantidad - a.cantidad)
            .slice(0, 10); // Top 10

        // 2. Stock Actual (Lista completa o paginada, aquí devolvemos todos para el reporte)
        const productosDB = await prisma.producto.findMany({
            orderBy: { nombre: 'asc' }
        });

        const LOW_STOCK_THRESHOLD = 10;
        const stockActual = productosDB.map(p => ({
            nombre: p.nombre,
            stockActual: p.stockActual || 0,
            minStock: LOW_STOCK_THRESHOLD,
            ubicacion: 'Almacén A',
            estado: (p.stockActual || 0) < LOW_STOCK_THRESHOLD ? 'Bajo Stock' : 'En Stock'
        }));

        // 3. Bitácora (Placeholder)
        const activityLog: any[] = [];

        const reportData = {
            productosMasVendidos,
            stockActual,
            activityLog,
            // Tabla genérica para el reporte
            tableData: stockActual.map(p => ({
                Producto: p.nombre,
                Stock: p.stockActual,
                Estado: p.estado
            }))
        };

        if (formatType === 'pdf') {
            const pdfBuffer = await generatePDF(reportData, 'Reporte de Productos');
            return new NextResponse(pdfBuffer as any, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=reporte_productos.pdf'
                }
            });
        } else if (formatType === 'excel') {
            const excelBuffer = await generateExcel(reportData, 'Reporte de Productos');
            return new NextResponse(excelBuffer as any, {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': 'attachment; filename=reporte_productos.xlsx'
                }
            });
        }

        return NextResponse.json(reportData);

    } catch (error) {
        console.error('Error fetching products report:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
