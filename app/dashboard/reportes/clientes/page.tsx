import { prisma } from "@/lib/prisma";
import CustomersReportClient, { CustomersReportData } from "./CustomersReportClient";

export const dynamic = 'force-dynamic';

export default async function CustomersReportPage() {
  // 1. Métricas Clientes
  const totalCustomers = await prisma.cliente.count();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const newCustomersThisMonth = await prisma.cliente.count({
    where: { fechaRegistro: { gte: startOfMonth } }
  });

  // 2. Top Clientes
  // Obtener clientes con sus pedidos y facturas
  const clientes = await prisma.cliente.findMany({
    include: {
      persona: true,
      pedidos: {
        include: {
          facturas: true
        }
      }
    }
  });

  const processedCustomers = clientes.map(c => {
    let totalSpent = 0;
    let totalPurchases = 0;

    c.pedidos.forEach(p => {
      p.facturas.forEach(f => {
        totalSpent += Number(f.total || 0);
        totalPurchases++;
      });
    });

    return {
      id: c.id,
      name: `${c.persona.nombre} ${c.persona.apellido}`.trim(),
      totalPurchases,
      totalSpent
    };
  });

  // Ordenar por gasto descendente
  processedCustomers.sort((a, b) => b.totalSpent - a.totalSpent);

  const data: CustomersReportData = {
    totalCustomers,
    newCustomersThisMonth,
    topCustomers: processedCustomers.slice(0, 20)
  };

  return <CustomersReportClient data={data} />;
}
