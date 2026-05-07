import type { Metadata } from 'next';
import { ProductDetailsClient } from '@/components/ProductDetailsClient';
import { getProducts, getProductById } from '@/lib/api';

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((p) => ({ id: String(p.id) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProductById(Number(id));
    const priceNaira = (product.price / 100).toLocaleString('en-NG');
    return {
      title: `${product.name} — ₦${priceNaira} | Buy Red Palm Oil Online`,
      description: `${product.description || product.name}. ₦${priceNaira}. Food-grade certified red palm oil. Fast delivery across Nigeria. Order now from Kece Oil.`,
      openGraph: {
        title: `${product.name} | Kece Oil`,
        description: `Buy ${product.name} for ₦${priceNaira}. Premium red palm oil with fast delivery.`,
        images: product.image_url
          ? [{ url: product.image_url, width: 800, height: 800, alt: product.name }]
          : undefined,
        url: `https://keceoil.com/products/${id}`,
      },
      alternates: {
        canonical: `https://keceoil.com/products/${id}`,
      },
    };
  } catch {
    return {
      title: 'Product Details | Kece Oil',
      description: 'View product details and order premium red palm oil from Kece Oil.',
    };
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch product for JSON-LD (server-side)
  let jsonLd = null;
  try {
    const product = await getProductById(Number(id));
    const priceNaira = (product.price / 100).toFixed(2);
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description || product.name,
      image: product.image_url,
      brand: { '@type': 'Brand', name: 'Kece Oil' },
      offers: {
        '@type': 'Offer',
        url: `https://keceoil.com/products/${id}`,
        priceCurrency: 'NGN',
        price: priceNaira,
        availability: product.available
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: 'Kece Oil' },
      },
    };
  } catch {
    // Fallback: no JSON-LD
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://keceoil.com' },
              { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://keceoil.com/products' },
              { '@type': 'ListItem', position: 3, name: jsonLd?.name || 'Product', item: `https://keceoil.com/products/${id}` },
            ],
          }),
        }}
      />
      <ProductDetailsClient productId={id} />
    </>
  );
}
