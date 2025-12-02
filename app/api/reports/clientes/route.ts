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

        // 1. Clientes por Tipo
        // Contamos clientes agrupados por TipoCliente
        const clientesPorTipoDB = await prisma.cliente.groupBy({
            by: ['tipoClienteId'],
            _count: {
                id: true,
            },
        });

        // Necesitamos los nombres de los tipos
        const tiposCliente = await prisma.tipoCliente.findMany();
        const tiposMap = new Map(tiposCliente.map(t => [t.id, t.nombre]));

        const clientesPorTipo = clientesPorTipoDB.map(item => ({
            name: item.tipoClienteId ? tiposMap.get(item.tipoClienteId) : 'Sin Tipo',
            valor: item._count.id,
            count: item._count.id // Para el tooltip
        }));

        // Si no hay datos, devolvemos algo vacío o genérico
        if (clientesPorTipo.length === 0) {
            clientesPorTipo.push({ name: 'General', valor: await prisma.cliente.count(), count: await prisma.cliente.count() });
        }

        // 2. Top Clientes por Compras (en el rango de fechas)
        // Buscamos facturas en el rango, unimos con pedidos y clientes
        const topClientesDB = await prisma.factura.findMany({
            where: {
                fecha: {
                    gte: startDate,
                    lte: endDate,
                },
                pedido: {
                    clienteId: { not: null }
                }
            },
            include: {
                pedido: {
                    include: {
                        cliente: {
                            include: {
                                persona: true
                            }
                        }
                    }
                }
            }
        });

        // Agrupar por cliente y sumar
        const clientesGastos = new Map();
        topClientesDB.forEach(f => {
            if (!f.pedido?.cliente) return;
            const clienteId = f.pedido.cliente.id;
            const nombre = `${f.pedido.cliente.persona.nombre} ${f.pedido.cliente.persona.apellido}`;
            const current = clientesGastos.get(clienteId) || { cliente: nombre, totalGastado: 0 };
            clientesGastos.set(clienteId, {
                cliente: nombre,
                totalGastado: current.totalGastado + Number(f.total || 0)
            });
        });

        const clientesTopCompras = Array.from(clientesGastos.values())
            .sort((a: any, b: any) => b.totalGastado - a.totalGastado)
            .slice(0, 5); // Top 5

        // 3. Bitácora de Clientes (Simulada o real si hubiera tabla específica)
        // Usaremos BitacoraActividadGeneral filtrando por tabla 'clientes' si existe, o devolvemos vacío
        // Por ahora vacío o datos dummy si no hay bitácora real poblada
        const clientActivityLog: any[] = [];

        const reportData = {
            clientesPorTipo,
            clientesTopCompras,
            clientActivityLog,
            // Tabla genérica para el reporte
            tableData: clientesTopCompras.map(c => ({
                Cliente: c.cliente,
                'Total Gastado': `Bs. ${c.totalGastado.toLocaleString()}`
            }))
        };

        if (formatType === 'pdf') {
            const pdfBuffer = await generatePDF(reportData, 'Reporte de Clientes');
            return new NextResponse(pdfBuffer as any, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=reporte_clientes.pdf'
                }
            });
        } else if (formatType === 'excel') {
            const excelBuffer = await generateExcel(reportData, 'Reporte de Clientes');
            return new NextResponse(excelBuffer as any, {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': 'attachment; filename=reporte_clientes.xlsx'
                }
            });
        }

        return NextResponse.json(reportData);

    } catch (error) {
        console.error('Error fetching clients report:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
