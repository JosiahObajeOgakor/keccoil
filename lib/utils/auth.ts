// Admin authentication using API key
// Key is stored in sessionStorage and sent as X-Admin-Key header

const STORAGE_KEY = 'adminApiKey';

export function getAdminKey(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

export function setAdminKey(key: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, key);
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminKey();
}
