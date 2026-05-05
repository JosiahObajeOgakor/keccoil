import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://keceoil.com';

  let productUrls: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productUrls = products.map((p) => ({
      url: `${baseUrl}/products/${p.id}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date('2025-01-01'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // Fallback to hardcoded IDs if API unavailable at build
    productUrls = [1, 2, 3, 4, 5, 6, 7, 8].map((id) => ({
      url: `${baseUrl}/products/${id}`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date('2025-01-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...productUrls,
  ];
}
