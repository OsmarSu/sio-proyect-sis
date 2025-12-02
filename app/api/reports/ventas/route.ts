import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from 'date-fns';
import { es } from 'date-fns/locale';

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

        // 1. Ventas Diarias
        const facturas = await prisma.factura.findMany({
            where: {
                fecha: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: {
                fecha: 'asc',
            },
        });

        // Agrupar por día
        const ventasMap = new Map();

        facturas.forEach(f => {
            if (!f.fecha) return;
            const dia = format(f.fecha, 'dd', { locale: es });
            const current = ventasMap.get(dia) || { total: 0, items: 0 };
            ventasMap.set(dia, {
                total: current.total + Number(f.total || 0),
                items: current.items + 1 // Contamos facturas como "items" de venta por simplicidad, o podríamos sumar detalles
            });
        });

        const ventasDiarias = Array.from(ventasMap.entries()).map(([dia, data]) => ({
            dia,
            total: data.total,
            items: data.items
        })).sort((a, b) => Number(a.dia) - Number(b.dia));

        // 2. Ventas por Vendedor (Mock por ahora ya que no tenemos usuario en venta)
        // Si tuviéramos usuario en pedido/factura, haríamos un groupBy
        const totalVentasPeriodo = facturas.reduce((acc, curr) => acc + Number(curr.total || 0), 0);

        const ventasPorVendedor = [
            {
                vendedor: 'Sistema / General',
                ventas: totalVentasPeriodo,
                comision: 0
            }
        ];

        const reportData = {
            ventasDiarias,
            ventasPorVendedor,
            // Para el generador genérico, podemos mapear ventasDiarias a tableData
            tableData: ventasDiarias.map(v => ({
                Dia: v.dia,
                Total: `Bs. ${v.total.toLocaleString()}`,
                Transacciones: v.items
            }))
        };

        if (formatType === 'pdf') {
            const pdfBuffer = await generatePDF(reportData, 'Reporte de Ventas');
            return new NextResponse(pdfBuffer as any, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=reporte_ventas.pdf'
                }
            });
        } else if (formatType === 'excel') {
            const excelBuffer = await generateExcel(reportData, 'Reporte de Ventas');
            return new NextResponse(excelBuffer as any, {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': 'attachment; filename=reporte_ventas.xlsx'
                }
            });
        }

        return NextResponse.json(reportData);

    } catch (error) {
        console.error('Error fetching sales report:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
