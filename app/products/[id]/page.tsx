import { PRODUCTS } from '@/lib/mockData';
import { ProductDetailsClient } from '@/components/ProductDetailsClient';

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailsClient productId={id} />;
}
