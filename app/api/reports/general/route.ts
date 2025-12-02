import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

import { generatePDF, generateExcel } from '@/lib/report-generator';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || 'month';
        const formatType = searchParams.get('format'); // 'pdf' or 'excel'

        // Rango actual (para métricas principales)
        // Simplificación: Usaremos "Este Mes" como base si range=month, etc.
        // Para "Metrics", calcularemos totales globales o del mes actual vs mes anterior.

        const now = new Date();
        const startCurrentMonth = startOfMonth(now);
        const endCurrentMonth = endOfMonth(now);
        const startLastMonth = startOfMonth(subMonths(now, 1));
        const endLastMonth = endOfMonth(subMonths(now, 1));

        // 1. Métricas Generales (Comparativa Mes Actual vs Anterior)

        // Ventas
        const ventasActual = await prisma.factura.aggregate({
            _sum: { total: true },
            where: { fecha: { gte: startCurrentMonth, lte: endCurrentMonth } }
        });
        const ventasAnterior = await prisma.factura.aggregate({
            _sum: { total: true },
            where: { fecha: { gte: startLastMonth, lte: endLastMonth } }
        });
        const totalVentas = Number(ventasActual._sum.total || 0);
        const totalVentasLast = Number(ventasAnterior._sum.total || 0);
        const ventasTrend = totalVentas >= totalVentasLast ? 'up' : 'down';
        const ventasChange = totalVentasLast === 0 ? '100%' : `${(((totalVentas - totalVentasLast) / totalVentasLast) * 100).toFixed(1)}%`;

        // Productos (Total global)
        const totalProductos = await prisma.producto.count();

        // Clientes (Total global)
        const totalClientes = await prisma.cliente.count();

        // Pedidos (Mes actual)
        const pedidosActual = await prisma.pedido.count({
            where: { fecha: { gte: startCurrentMonth, lte: endCurrentMonth } }
        });

        const metrics = [
            { titulo: 'Ventas Totales', valor: `Bs. ${totalVentas.toLocaleString()}`, cambio: ventasChange, trend: ventasTrend },
            { titulo: 'Total Productos', valor: totalProductos, cambio: '+0%', trend: 'up' }, // Placeholder change
            { titulo: 'Total Clientes', valor: totalClientes, cambio: '+0%', trend: 'up' },
            { titulo: 'Pedidos del Mes', valor: pedidosActual, cambio: 'N/A', trend: 'up' }
        ];

        // 2. Tendencia de Ventas (Últimos 6 meses)
        const ventasMensuales = [];
        for (let i = 5; i >= 0; i--) {
            const d = subMonths(now, i);
            const start = startOfMonth(d);
            const end = endOfMonth(d);

            const sum = await prisma.factura.aggregate({
                _sum: { total: true },
                where: { fecha: { gte: start, lte: end } }
            });

            ventasMensuales.push({
                mes: format(d, 'MMM', { locale: es }),
                ventas: Number(sum._sum.total || 0)
            });
        }

        // 3. Ventas por Categoría (Global o Mes Actual - Usaremos Mes Actual)
        const detalles = await prisma.detalleFactura.findMany({
            where: {
                factura: {
                    fecha: { gte: startCurrentMonth, lte: endCurrentMonth }
                }
            },
            include: { producto: { include: { categoria: true } } }
        });

        const catMap = new Map();
        detalles.forEach(d => {
            const cat = d.producto?.categoria?.nombre || 'Sin Categoría';
            const val = Number(d.precioUnitario || 0) * (d.cantidad || 0);
            catMap.set(cat, (catMap.get(cat) || 0) + val);
        });

        const ventasPorCategoria = Array.from(catMap.entries()).map(([name, valor]) => ({ name, valor }));

        const reportData = {
            metrics,
            ventasMensuales,
            ventasPorCategoria
        };

        // MANEJO DE DESCARGAS
        if (formatType === 'pdf') {
            const pdfBuffer = await generatePDF(reportData, 'Reporte General');
            return new NextResponse(pdfBuffer as any, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=reporte_general.pdf'
                }
            });
        } else if (formatType === 'excel') {
            const excelBuffer = await generateExcel(reportData, 'Reporte General');
            return new NextResponse(excelBuffer as any, {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': 'attachment; filename=reporte_general.xlsx'
                }
            });
        }

        return NextResponse.json(reportData);

    } catch (error) {
        console.error('Error fetching general report:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
