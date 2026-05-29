import { create } from 'zustand';
import type { TenantUser, Tenant } from '@/lib/types';

interface AuthState {
  user: TenantUser | null;
  tenant: Tenant | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  forcePasswordChange: boolean;
  adminKey: string | null;
  pendingWalletRef: string | null;

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
  setForcePasswordChange: (flag: boolean) => void;
  setAdminKey: (key: string | null) => void;
  setPendingWalletRef: (ref: string | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tenant: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: true, // No async hydration needed — store is source of truth
  forcePasswordChange: false,
  adminKey: null,
  pendingWalletRef: null,

  setAuth: ({ user, tenant, accessToken, refreshToken }) => {
    set({
      user,
      tenant: tenant ?? null,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  setAccessToken: (token: string) => {
    set({ accessToken: token, isAuthenticated: true });
  },

  getRefreshToken: () => get().refreshToken,

  logout: () => {
    set({
      user: null,
      tenant: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      forcePasswordChange: false,
      pendingWalletRef: null,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setHydrated: () => set({ isHydrated: true }),
  setForcePasswordChange: (flag) => set({ forcePasswordChange: flag }),
  setAdminKey: (key) => set({ adminKey: key }),
  setPendingWalletRef: (ref) => set({ pendingWalletRef: ref }),
}));
