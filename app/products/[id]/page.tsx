import { ProductDetailsClient } from '@/components/ProductDetailsClient';
import { getProducts } from '@/lib/api';

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((p) => ({ id: String(p.id) }));
  } catch {
    return [];
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailsClient productId={id} />;
}
