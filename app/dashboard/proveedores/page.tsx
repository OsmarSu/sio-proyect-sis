import React, { Suspense } from 'react';
import { getProviders } from '@/actions/provider-actions';
import { ProveedoresContent } from './ProveedoresContent';

export const dynamic = 'force-dynamic';

export default async function ProveedoresPage() {
  const providers = await getProviders();

  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando proveedores...</div>}>
      <ProveedoresContent initialProviders={providers} />
    </Suspense>
  );
}