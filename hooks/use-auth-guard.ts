'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { refreshAccessTokenSilent } from '@/lib/api';

export function useAuthGuard() {
  const router = useRouter();
  const { user, tenant, accessToken, isAuthenticated, isHydrated, logout } =
    useAuthStore();

  // Silently refresh access token using the shared mutex-protected refresh
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      const newToken = await refreshAccessTokenSilent();
      if (!newToken) {
        logout();
      }
    }, 13 * 60 * 1000); // every 13 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, logout]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  return { user, tenant, accessToken, isAuthenticated, isLoading: !isHydrated };
}
