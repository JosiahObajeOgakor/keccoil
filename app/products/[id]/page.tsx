import { ProductDetailsClient } from '@/components/ProductDetailsClient';

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailsClient productId={id} />;
}
