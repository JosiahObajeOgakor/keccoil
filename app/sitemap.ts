import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const PRODUCT_IDS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://keceoil.com';

  const productUrls = PRODUCT_IDS.map((id) => ({
    url: `${baseUrl}/products/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ];
}
