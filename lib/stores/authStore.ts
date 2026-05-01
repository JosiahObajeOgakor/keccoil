import { create } from 'zustand';
import type { TenantUser, Tenant } from '@/lib/types';

const REFRESH_TOKEN_KEY = 'keceoil_refresh_token';

interface AuthState {
  user: TenantUser | null;
  tenant: Tenant | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;

  setAuth: (data: {
    user: TenantUser;
    tenant?: Tenant | null;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setAccessToken: (token: string) => void;
  getRefreshToken: () => string | null;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tenant: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,

  setAuth: ({ user, tenant, accessToken, refreshToken }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    set({
      user,
      tenant: tenant ?? null,
      accessToken,
      isAuthenticated: true,
    });
  },

  setAccessToken: (token: string) => {
    set({ accessToken: token, isAuthenticated: true });
  },

  getRefreshToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    set({
      user: null,
      tenant: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setHydrated: () => set({ isHydrated: true }),
}));
