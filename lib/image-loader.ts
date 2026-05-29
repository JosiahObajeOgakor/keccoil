'use client';

interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderParams): string {
  // Local images — no CDN to resize, return as-is
  if (src.startsWith('/')) return src;

  // Non-Cloudinary URLs — pass through
  if (!src.includes('res.cloudinary.com')) return src;

  const q = quality || 'auto';
  const transforms = `q_${q}/f_auto/w_${width}/c_limit`;

  if (src.includes('/upload/')) {
    // Remove any existing q_, f_, w_, c_ transforms to avoid conflicts
    const cleaned = src.replace(/\/(q_[^/]+|f_[^/]+|w_[^/]+|c_[^/]+)\//g, '/');
    return cleaned.replace('/upload/', `/upload/${transforms}/`);
  }

  return src;
}
