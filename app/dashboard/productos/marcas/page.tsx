import { getBrands } from '@/actions/get-brands';
import { BrandsClient } from '@/components/products/brands-list'; // Ahora sí lo encontrará

export const dynamic = 'force-dynamic';

export default async function MarcasPage() {
  const brands = await getBrands();
  return (
    <div className="h-full w-full">
      <BrandsClient initialBrands={brands} />
    </div>
  );
}