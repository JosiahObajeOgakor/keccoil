// Admin authentication using API key — stored in Zustand (in-memory only)
import { useAuthStore } from '@/lib/stores/authStore';

export function getAdminKey(): string | null {
  return useAuthStore.getState().adminKey;
}

export function setAdminKey(key: string): void {
  useAuthStore.getState().setAdminKey(key);
}

export function clearAdminSession(): void {
  useAuthStore.getState().setAdminKey(null);
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminKey();
}
