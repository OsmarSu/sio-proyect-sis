import { prisma } from "@/lib/prisma";
import SalesReportClient, { SalesReportData } from "./SalesReportClient";

export const dynamic = 'force-dynamic';

export default async function SalesReportPage() {
  // 1. Ventas Diarias (Últimos 30 días)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const ventasRecientes = await prisma.venta.findMany({
    where: {
      fecha: { gte: thirtyDaysAgo }
    },
    include: { factura: true },
    orderBy: { fecha: 'asc' }
  });

  const ventasPorDiaMap = new Map<string, number>();
  ventasRecientes.forEach(v => {
    if (v.fecha && v.factura?.total) {
      const dateStr = v.fecha.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit' });
      ventasPorDiaMap.set(dateStr, (ventasPorDiaMap.get(dateStr) || 0) + Number(v.factura.total));
    }
  });

  const dailySales = Array.from(ventasPorDiaMap.entries()).map(([date, total]) => ({ date, total }));

  // 2. Transacciones Recientes (Top 20)
  const lastTransactions = await prisma.venta.findMany({
    take: 20,
    orderBy: { fecha: 'desc' },
    include: {
      factura: {
        include: {
          detalles: true,
          pedido: {
            include: {
              cliente: {
                include: { persona: true }
              }
            }
          }
        }
      }
    }
  });

  const recentTransactions = lastTransactions.map(tx => ({
    id: tx.id,
    date: tx.fecha ? tx.fecha.toLocaleDateString() + ' ' + tx.fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
    customer: tx.factura?.pedido?.cliente?.persona
      ? `${tx.factura.pedido.cliente.persona.nombre} ${tx.factura.pedido.cliente.persona.apellido}`
      : 'Cliente Casual',
    total: Number(tx.factura?.total || 0),
    items: tx.factura?.detalles.length || 0
  }));

  const data: SalesReportData = {
    dailySales,
    recentTransactions
  };

  return <SalesReportClient data={data} />;
}
