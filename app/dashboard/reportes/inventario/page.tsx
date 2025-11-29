import { prisma } from "@/lib/prisma";
import InventoryReportClient, { InventoryReportData } from "./InventoryReportClient";

export const dynamic = 'force-dynamic';

export default async function InventoryReportPage() {
  // 1. Obtener todo el inventario con productos y precios
  const inventory = await prisma.inventario.findMany({
    include: {
      producto: {
        include: {
          categoria: true,
          precios: true // Para calcular valor estimado
        }
      }
    }
  });

  let totalValue = 0;
  let totalItems = 0;
  let lowStockCount = 0;
  const categoryMap = new Map<string, number>();
  const lowStockItems = [];

  inventory.forEach(item => {
    const stock = item.stock || 0;
    const price = Number(item.producto?.precios[0]?.monto || 0); // Precio de venta aprox

    totalItems += stock;
    totalValue += (stock * price); // Valorización a precio de venta (o costo si tuviéramos)

    if (stock < 10) {
      lowStockCount++;
      lowStockItems.push({
        id: item.productoId || 0,
        name: item.producto?.nombre || 'Desconocido',
        stock: stock,
        category: item.producto?.categoria?.nombre || 'Sin Categoría'
      });
    }

    const catName = item.producto?.categoria?.nombre || 'Otros';
    categoryMap.set(catName, (categoryMap.get(catName) || 0) + stock);
  });

  const stockByCategory = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

  const data: InventoryReportData = {
    totalValue,
    totalItems,
    lowStockCount,
    stockByCategory,
    lowStockItems: lowStockItems.sort((a, b) => a.stock - b.stock).slice(0, 20) // Top 20 críticos
  };

  return <InventoryReportClient data={data} />;
}
