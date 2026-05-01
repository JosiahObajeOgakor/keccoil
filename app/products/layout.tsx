import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Red Palm Oil Products — All Sizes From 3L to 100L',
  description:
    'Browse our full range of premium red palm oil. 3L, 5L, 10L, 20L, 25L, 50L, and 100L sizes. Wholesale pricing from ₦9,500. Food-grade certified. Fast delivery across Nigeria.',
  openGraph: {
    title: 'Red Palm Oil Products | Kecc Oil',
    description:
      'Browse premium red palm oil in all sizes. Wholesale pricing, fast delivery across Nigeria.',
  },
  alternates: {
    canonical: 'https://keceoil.com/products',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
