'use client';

import { useLoaderStore } from '@/lib/stores/loaderStore';

export function GlobalLoader() {
  const isLoading = useLoaderStore((s) => s.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        {/* Inner oil drop icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">🛢️</span>
        </div>
      </div>
      {/* Text */}
      <p className="text-sm font-semibold text-foreground animate-pulse">
        Kecc Oil Loading
      </p>
    </div>
  );
}
