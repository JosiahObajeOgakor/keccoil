'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { refreshAccessToken } from '@/lib/api';

export function useAuthGuard() {
  const router = useRouter();
  const { user, tenant, accessToken, isAuthenticated, isHydrated, setAuth, setAccessToken, logout, setHydrated } =
    useAuthStore();

  useEffect(() => {
    if (isHydrated) return;

    const tryHydrate = async () => {
      if (typeof window === 'undefined') return;
      const refreshToken = sessionStorage.getItem('keceoil_refresh_token');
      if (!refreshToken) {
        setHydrated();
        return;
      }

      try {
        const data = await refreshAccessToken(refreshToken);
        setAccessToken(data.access_token);
        sessionStorage.setItem('keceoil_refresh_token', data.refresh_token);
      } catch {
        logout();
      }
      setHydrated();
    };

    tryHydrate();
  }, [isHydrated, setAccessToken, logout, setHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  return { user, tenant, accessToken, isAuthenticated, isLoading: !isHydrated };
}
