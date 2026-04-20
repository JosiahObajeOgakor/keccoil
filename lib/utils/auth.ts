// Simple admin authentication utilities
// For MVP only - in production, use proper session management

const ADMIN_PASSWORD_HASH = 'admin123'; // Simple hash for demo purposes

export interface AdminSession {
  isAuthenticated: boolean;
  adminName?: string;
}

export function validateAdminPassword(password: string): boolean {
  // In production, use bcrypt or similar
  return password === ADMIN_PASSWORD_HASH;
}

export function getStoredSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  
  const session = sessionStorage.getItem('adminSession');
  if (!session) return null;
  
  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
}

export function setAdminSession(adminName: string): void {
  if (typeof window === 'undefined') return;
  
  const session: AdminSession = {
    isAuthenticated: true,
    adminName,
  };
  
  sessionStorage.setItem('adminSession', JSON.stringify(session));
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('adminSession');
}

export function isAdminAuthenticated(): boolean {
  const session = getStoredSession();
  return session?.isAuthenticated ?? false;
}
