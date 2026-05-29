'use client';

import { useEffect } from 'react';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useAuthStore } from '@/lib/stores/authStore';
import { TenantSidebar } from '@/components/tenant/TenantSidebar';
import ChangePasswordModal from '@/components/ChangePasswordModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuthGuard();
  const forcePasswordChange = useAuthStore((s) => s.forcePasswordChange);
  const setForcePasswordChange = useAuthStore((s) => s.setForcePasswordChange);

  const handlePasswordChanged = () => {
    setForcePasswordChange(false);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TenantSidebar />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-6">
          {children}
        </div>
      </main>
      <ChangePasswordModal open={forcePasswordChange} onComplete={handlePasswordChanged} />
    </div>
  );
}
