// app/dashboard/inventario/page.tsx
import { prisma } from "@/lib/prisma";
import InventarioClient, { InventoryItem } from "./InventarioClient";

export const dynamic = 'force-dynamic';

export default async function InventarioPage() {
  const dbInventory = await prisma.inventario.findMany({
    include: {
      producto: true,
      almacen: true,
    },
    orderBy: {
      id: 'desc', // O ordenar por producto
    },
  });

  const formattedInventory: InventoryItem[] = dbInventory.map((inv) => ({
    id: inv.id,
    productName: inv.producto?.nombre || "Producto Desconocido",
    sku: inv.producto?.id ? `PROD-${inv.producto.id.toString().padStart(4, '0')}` : "S/N",
    warehouseName: inv.almacen?.nombre || "Almacén General",
    stock: inv.stock || 0,
    lastUpdated: new Date().toISOString(), // Prisma schema no tiene updatedAt en Inventario, usamos fecha actual o agregamos campo
  }));

  return <InventarioClient initialInventory={formattedInventory} />;
}