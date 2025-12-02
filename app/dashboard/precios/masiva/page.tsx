import React, { Suspense } from 'react';
import { getPricedProducts } from '@/actions/get-priced-products';
import { MasivaContent } from './MasivaContent';

export const dynamic = 'force-dynamic';

export default async function MasivaPage() {
  const products = await getPricedProducts();

  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando actualización masiva...</div>}>
      <MasivaContent initialProducts={products} />
    </Suspense>
  );
}