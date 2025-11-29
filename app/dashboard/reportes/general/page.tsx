import { prisma } from "@/lib/prisma";
import GeneralReportClient, { GeneralReportData } from "./GeneralReportClient";

export const dynamic = 'force-dynamic';

export default async function GeneralReportPage() {
    // 1. Métricas Generales
    const totalVentasAgg = await prisma.factura.aggregate({
        _sum: { total: true },
        where: { ventas: { some: {} } }
    });
    const totalVentas = Number(totalVentasAgg._sum.total || 0);

    // Productos Vendidos (Sumar cantidad de detalleFactura donde hay venta)
    // Aproximación: Sumar todas las cantidades de DetalleFactura asociadas a facturas de venta
    const productosVendidosAgg = await prisma.detalleFactura.aggregate({
        _sum: { cantidad: true },
        where: { factura: { ventas: { some: {} } } }
    });
    const totalProductos = productosVendidosAgg._sum.cantidad || 0;

    const nuevosClientes = await prisma.cliente.count({
        where: {
            fechaRegistro: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // Desde inicio de mes
            }
        }
    });

    const totalTransacciones = await prisma.venta.count();
    const ticketPromedio = totalTransacciones > 0 ? totalVentas / totalTransacciones : 0;

    // 2. Ventas Mensuales (Agregación manual o raw query si fuera necesario, aquí simulamos con JS por simplicidad en Prisma)
    // Para producción con muchos datos, usar groupBy de Prisma o Raw Query.
    const ventasRaw = await prisma.venta.findMany({
        include: { factura: true },
        orderBy: { fecha: 'asc' }
    });

    const ventasPorMesMap = new Map<string, number>();
    ventasRaw.forEach(v => {
        if (v.fecha && v.factura?.total) {
            const mes = v.fecha.toLocaleString('es-BO', { month: 'short' });
            const monto = Number(v.factura.total);
            ventasPorMesMap.set(mes, (ventasPorMesMap.get(mes) || 0) + monto);
        }
    });

    const ventasMensuales = Array.from(ventasPorMesMap.entries()).map(([mes, ventas]) => ({ mes, ventas }));

    // 3. Ventas por Categoría
    // Necesitamos join complejo: Venta -> Factura -> Detalle -> Producto -> Categoria
    // Lo haremos obteniendo detalles de ventas
    const detallesVentas = await prisma.detalleFactura.findMany({
        where: { factura: { ventas: { some: {} } } },
        include: {
            producto: {
                include: { categoria: true }
            }
        }
    });

    const categoriasMap = new Map<string, number>();
    let totalCategorias = 0;

    detallesVentas.forEach(d => {
        const catNombre = d.producto?.categoria?.nombre || 'Sin Categoría';
        const monto = Number(d.precioUnitario || 0) * (d.cantidad || 0);
        categoriasMap.set(catNombre, (categoriasMap.get(catNombre) || 0) + monto);
        totalCategorias += monto;
    });

    const ventasPorCategoria = Array.from(categoriasMap.entries()).map(([categoria, monto]) => ({
        categoria,
        monto,
        valor: totalCategorias > 0 ? parseFloat(((monto / totalCategorias) * 100).toFixed(1)) : 0
    }));

    const data: GeneralReportData = {
        metrics: {
            totalVentas,
            totalProductos,
            nuevosClientes,
            ticketPromedio
        },
        ventasMensuales,
        ventasPorCategoria
    };

    return <GeneralReportClient data={data} />;
}
