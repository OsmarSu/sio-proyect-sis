import React, { Suspense } from 'react';
import { getPricedProducts } from '@/actions/get-priced-products';
import { ListadoContent } from './ListadoContent';

export const dynamic = 'force-dynamic';

export default async function ListadoPage() {
  const products = await getPricedProducts();

  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando listado de precios...</div>}>
      <ListadoContent initialProducts={products} />
    </Suspense>
  );
}