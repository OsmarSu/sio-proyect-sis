// app/dashboard/ventas/page.tsx
import { prisma } from "@/lib/prisma";
import VentasClient, { ProductoVenta, ClienteVenta } from "./VentasClient";

export const dynamic = 'force-dynamic';

export default async function VentasPage() {
  // 1. Obtener Productos con Stock, Categoría y Precio
  const dbProducts = await prisma.producto.findMany({
    where: {
      // Opcional: Solo productos activos o con stock
      // stockActual: { gt: 0 } 
    },
    include: {
      categoria: true,
      precios: {
        orderBy: { id: 'desc' },
        take: 1,
      },
      inventarios: true,
    },
  });

  const formattedProducts: ProductoVenta[] = dbProducts.map((p) => {
    // Calcular stock total
    const totalStock = p.inventarios.reduce((acc, curr) => acc + (curr.stock || 0), 0);

    // Obtener precio actual
    const precio = p.precios[0]?.monto ? Number(p.precios[0].monto) : 0;

    return {
      id: p.id,
      nombre: p.nombre || "Sin Nombre",
      precio: precio,
      stock: totalStock,
      category: p.categoria?.nombre || "General",
      sku: `PROD-${p.id.toString().padStart(4, '0')}`,
    };
  });

  // 2. Obtener Clientes
  const dbClients = await prisma.cliente.findMany({
    include: {
      persona: true,
      tipoCliente: true,
    },
  });

  const formattedClients: ClienteVenta[] = dbClients.map((c) => ({
    id: c.id,
    nombre: `${c.persona.nombre} ${c.persona.apellido}`.trim(),
    ci: c.persona.documento || "",
    tipo: c.tipoCliente?.nombre || "Normal",
  }));

  return <VentasClient initialProducts={formattedProducts} initialClients={formattedClients} />;
}
