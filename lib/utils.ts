import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Optimizes a Cloudinary image URL by injecting transformation parameters.
 * Adds auto-format (WebP/AVIF), auto-quality, and optional width constraint.
 */
export function optimizeCloudinaryUrl(url: string, width?: number): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  // Already has transforms — don't double-apply
  if (url.includes('/q_auto') && url.includes('/f_auto')) {
    // Still add width if requested and not present
    if (width && !url.includes('/w_')) {
      return url.replace('/q_auto', `/q_auto/w_${width}/c_limit`);
    }
    return url;
  }

  const transforms = width
    ? `q_auto/f_auto/w_${width}/c_limit`
    : 'q_auto/f_auto';

  return url.replace('/upload/', `/upload/${transforms}/`);
}
