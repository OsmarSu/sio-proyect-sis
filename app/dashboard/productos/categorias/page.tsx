import { getCategories } from '@/actions/get-categories';
import { CategoriesClient } from '@/components/products/categories-list'; // Renombrado para semántica

export const dynamic = 'force-dynamic';

export default async function CategoriasPage() {
  const categories = await getCategories();

  return (
    <div className="h-full w-full">
      <CategoriesClient initialCategories={categories} />
    </div>
  );
}