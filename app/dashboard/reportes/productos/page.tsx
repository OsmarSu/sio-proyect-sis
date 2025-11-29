import { prisma } from "@/lib/prisma";
import ProductsReportClient, { ProductsReportData } from "./ProductsReportClient";

export const dynamic = 'force-dynamic';

export default async function ProductsReportPage() {
  // 1. Obtener productos y sus ventas
  // Estrategia: Obtener todos los productos y sumar sus ventas desde DetalleFactura
  // Nota: Esto puede ser pesado con muchos datos. Idealmente usar groupBy en DetalleFactura.

  const products = await prisma.producto.findMany({
    include: {
      categoria: true,
      precios: true,
      inventarios: true,
      detalleFacturas: true // Relación agregada recientemente
    }
  });

  const processedProducts = products.map(p => {
    const soldCount = p.detalleFacturas.reduce((acc, curr) => acc + (curr.cantidad || 0), 0);
    return {
      id: p.id,
      name: p.nombre || 'Sin Nombre',
      category: p.categoria?.nombre || 'Sin Categoría',
      price: Number(p.precios[0]?.monto || 0),
      stock: p.inventarios[0]?.stock || 0,
      sold: soldCount
    };
  });

  // Ordenar por ventas descendente
  processedProducts.sort((a, b) => b.sold - a.sold);

  const topSelling = processedProducts.slice(0, 10).map(p => ({
    name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
    quantity: p.sold
  }));

  const data: ProductsReportData = {
    topSelling,
    productsList: processedProducts
  };

  return <ProductsReportClient data={data} />;
}
