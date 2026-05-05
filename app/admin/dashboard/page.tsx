'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/utils/auth';
import { getDashboardStats, type DashboardStats } from '@/lib/api';
import { DashboardCards } from '@/components/admin/DashboardCards';

const OrdersChart = dynamic(
  () => import('@/components/admin/OrdersChart').then((m) => ({ default: m.OrdersChart })),
  { ssr: false, loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" /> }
);

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    getDashboardStats().then((data) => {
      setStats(data);
      setIsLoading(false);
    });
  }, [router]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of today&apos;s business activity
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardCards stats={stats} isLoading={isLoading} />

      {/* Chart */}
      <div className="mt-8">
        <OrdersChart data={stats?.ordersByCity ?? []} isLoading={isLoading} />
      </div>
    </div>
  );
}
