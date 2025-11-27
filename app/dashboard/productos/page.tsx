// app/dashboard/productos/page.tsx
import prisma from "@/lib/prisma";
import ProductsClient from "./ProductsClient";
import { Product } from "./types";
import { Prisma } from "@prisma/client";

// 1. Definimos el tipo de la respuesta de la BD
type ProductWithRelations = Prisma.ProductoGetPayload<{
  include: {
    marca: true;
    categoria: true;
    inventarios: true;
    precios: true;
  };
}>;

export const dynamic = 'force-dynamic';

export default async function ProductosPage() {
  // 2. CONSULTA A LA BASE DE DATOS
  const dbProducts = await prisma.producto.findMany({
    include: {
      marca: true,
      categoria: true,
      inventarios: true,
      precios: {
        orderBy: { id: "desc" },
        take: 1,
      },
    },
    orderBy: {
      id: "desc", 
    },
  });

  // 3. TRANSFORMACIÓN DE DATOS
  const formattedProducts: Product[] = dbProducts.map((p: ProductWithRelations) => {
    
    const totalStock = p.inventarios.reduce((acc: number, curr: any) => {
      return acc + (curr.stock || 0);
    }, 0);
    
    const precioRaw = p.precios[0]?.monto;
    const precioVenta = precioRaw ? Number(precioRaw) : 0;
    
    return {
      id: p.id.toString(),
      code: `PROD-${p.id.toString().padStart(4, '0')}`, 
      name: p.nombre || "Sin Nombre",
      description: p.descripcion || "",
      category: p.categoria?.nombre || "General",
      supplier: p.marca?.nombre || "Genérico",
      
      currentStock: totalStock,
      minStock: 5,
      
      majorPrice: 0,
      minorPrice: precioVenta,
      
      ageRange: "3+ años",
      isNew: false,
      isOffer: false,
      active: totalStock > 0,
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  // 4. RENDERIZADO
  return <ProductsClient initialProducts={formattedProducts} />;
}