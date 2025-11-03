// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Product as PrismaProduct } from '@prisma/client';

export async function GET() {
  try {
    const allProductsFromDB = await prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // Mapeamos los datos al formato que espera el frontend
    const formattedProducts = allProductsFromDB.map((dbProduct: PrismaProduct) => ({
        id: dbProduct.id,
        name: dbProduct.name,
        price: dbProduct.price.toNumber(),
        originalPrice: undefined,
        category: dbProduct.category || 'General',
        ageRange: 'Todas las edades',
        image: dbProduct.imageUrl || '/api/placeholder/300/300',
        description: dbProduct.description || 'Sin descripción.',
        stock: dbProduct.stock,
        rating: 4.5,
        isNew: false,
        isOnSale: false,
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}