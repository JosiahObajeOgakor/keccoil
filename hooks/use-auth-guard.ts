'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { refreshAccessToken } from '@/lib/api';

export function useAuthGuard() {
  const router = useRouter();
  const { user, tenant, accessToken, refreshToken, isAuthenticated, isHydrated, setAccessToken, logout } =
    useAuthStore();

  // Silently refresh access token using in-memory refresh token
  useEffect(() => {
    if (!isAuthenticated || !refreshToken) return;

    // Refresh access token 1 minute before expiry (assume 15min token)
    const interval = setInterval(async () => {
      try {
        const data = await refreshAccessToken(refreshToken);
        setAccessToken(data.access_token);
      } catch {
        logout();
      }
    }, 13 * 60 * 1000); // every 13 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshToken, setAccessToken, logout]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  return { user, tenant, accessToken, isAuthenticated, isLoading: !isHydrated };
}
